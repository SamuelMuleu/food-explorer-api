const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        try {
            const userExists = await knex('users').where('email', email).first();

            if (userExists) {
                throw new AppError("Este Email já está em uso!");
            }

            const hashedPassword = await hash(password, 8);

            await knex('users').insert({
                name: name,
                email: email,
                password: hashedPassword
            });

            return response.status(201).json();
        } catch (error) {
            throw new AppError("Erro ao criar usuário: " + error.message);
        }
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id;

        try {
            let user = await knex('users').where('id', user_id).first();

            if (!user) {
                throw new AppError("Usuário não encontrado");
            }

            const userWithUpdateEmail = await knex('users').where('email', email).first();
            if (userWithUpdateEmail && userWithUpdateEmail.id !== user_id) {
                throw new AppError("Este e-mail já está em uso");
            }

            user.name = name ?? user.name;
            user.email = email ?? user.email;

            if (password && !old_password) {
                throw new AppError("Você precisa informar a senha antiga para definir a nova");
            }

            if (password && old_password) {
                const checkOldPassword = await compare(old_password, user.password);
                if (!checkOldPassword) {
                    throw new AppError("A senha antiga não confere");
                }
                user.password = await hash(password, 8);
            }

            await knex('users')
                .where('id', user_id)
                .update({
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    updated_at: knex.fn.now()
                });

            return response.status(200).json("Usuário atualizado");
        } catch (error) {
            throw new AppError("Erro ao atualizar usuário: " + error.message);
        }
    }
}

module.exports = UsersController;
