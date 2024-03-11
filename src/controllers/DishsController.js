
const knex = require("../database/knex");
const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");
const { UPLOADS_FOLDER } = require("../configs/upload");
const fs = require("fs");
const path = require("path");


class DishsController {
    async create(request, response) {
        try {
            const { name, preco, descricao, categoria, ingredientes } = request.body;
            const user_id = request.user.id;
            const imagem_path = request.file.filename;

            const [dish_id] = await knex("dish").insert({
                name,
                preco,
                descricao,
                categoria,
                user_id,

                imagem_path,

            });
            if (ingredientes && Array.isArray(ingredientes)) {
                const ingredientesObj = ingredientes.map(ingrediente => ({ name: ingrediente, dish_id: dish_id }));

                // Insere os ingredientes na tabela ingredientes
                await knex("ingredientes").insert(ingredientesObj);
            }


            const sucessMessage = "Prato criado com sucesso!";


            return response.status(201).json({ message: sucessMessage, dish_id });
        } catch (error) {
            console.error("Erro ao criar prato:", error);
            return response.status(500).json({ error: "Erro ao criar prato" });
        }
    }

    async show(request, response) {
        try {
            const { id } = request.params;
            const { searchTerm } = request.query;

            let dish;
            if (searchTerm) {
                dish = await knex("dish")
                    .where("name", "like", `%${searchTerm}%`)
                    .orWhere("descricao", "like", `%${searchTerm}%`)
                    .first();
            } else {
                dish = await knex("dish")
                    .where({ id })
                    .first();
            }

            if (!dish) {
                return response.status(404).json({ error: "Prato não encontrado" });
            }

            const ingredientes = await knex("ingredientes")
                .where({ dish_id: dish.id });

            dish.ingredientes = ingredientes;

            return response.json(dish);
        } catch (error) {
            console.error("Erro ao buscar prato:", error);
            return response.status(500).json({ error: "Erro ao buscar prato" });
        }


    }


    async delete(request, response) {
        try {
            const { id } = request.params;
            await knex("dish").where({ id }).delete();
            await knex("ingredientes").where({ dish_id: id }).delete();
            return response.json({ message: "Prato deletado com sucesso" });
        } catch (error) {
            console.error("Erro ao deletar prato:", error);
            return response.status(500).json({ error: "Erro ao deletar prato" });
        }
    }

    async index(request, response) {
        try {
            const { searchTerm } = request.query;
            let dishs;
    
            if (searchTerm) {
        
                dishs = await knex("dish")
                    .leftJoin("ingredientes", "dish.id", "ingredientes.dish_id")
                    .where("dish.name", "like", `%${searchTerm}%`)
                    .orWhere("ingredientes.name", "like", `%${searchTerm}%`)
                    .select("dish.*")
                    .distinct();
            } else {
                // Retorna todos os pratos se nenhum termo de pesquisa for fornecido
                dishs = await knex("dish").select("*");
            }
    
            return response.json(dishs);
        } catch (error) {
            console.error("Erro ao buscar pratos:", error);
            return response.status(500).json({ error: "Erro ao buscar pratos" });
        }
    }
    async update(request, response) {
        const { name, preco, descricao, categoria, ingredientes } = request.body;
        const imagem_path = request.file
        const { id } = request.params;

        try {
            // Verifica se o prato existe
            const dish = await knex("dish").where({ id }).first();
            if (!dish) {
                throw new AppError("Prato não existe ou já foi deletado!");
            }


            let imagem_path = dish.imagem_path;

            if (request.file) {
                imagem_path = request.file.filename;
            }

            const updatedDish = {
                name: name ?? dish.name,
                preco: preco ?? dish.preco,
                descricao: descricao ?? dish.descricao,
                categoria: categoria ?? dish.categoria,
                imagem_path: imagem_path,
            };

            // Remove os ingredientes associados ao prato na tabela ingredientes
            await knex("ingredientes").where({ dish_id: id }).delete();

            if (Array.isArray(ingredientes)) {
                const newIngredients = ingredientes.map(ingrediente => ({
                    name: ingrediente.name,
                    dish_id: id
                }));
                await knex("ingredientes").insert(newIngredients);

            }


            // Atualiza o prato na tabela dish
            await knex("dish").where({ id }).update(updatedDish);

            return response.status(200).json({ message: "Prato atualizado com sucesso", dish, ingredientes });
        } catch (error) {
            console.error("Erro ao atualizar prato:", error);
            return response.status(500).json({ error: "Erro ao atualizar prato" });
        }
    }






}
module.exports = DishsController;