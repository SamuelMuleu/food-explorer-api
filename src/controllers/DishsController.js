const knex = require("../database/knex");


class DishsController {

    async create(request, response) {
        const { name, preco, descricao, categoria, ingredientes, imagem } = request.body;
        const { user_id } = request.params;



        const [dish_id] = await knex("dish").insert({


            name,
            preco,
            descricao,
            categoria,
            ingredientes: ingredientes.join(","),
            user_id,
            imagem
        });



        const ingredientesInsert = ingredientes.map(item => {
            return {
                dish_id,

                name: item
            }
        });
        const sucessMessage = "Prato criado com sucesso!";

        await knex("ingredientes").insert(ingredientesInsert);



        return response.status(201).json({ message: sucessMessage, dish_id });

    } catch(error) {
        console.error("Erro ao criar prato:", error);

        return response.status(500).json({
            status: "error",
            message: "Ocorreu um erro durante a criação do prato. Consulte os logs para mais informações."
        });
    }
    async show(request, response) {
        const { id } = request.params;

        const dish = await knex("dish").where({ id }).first();
        const ingredientes = await knex("ingredientes").where({ dish_id: id }).orderBy("name")

        return response.json({
            ...dish,
            ingredientes
        })

    }

    async delete(request, response) {


        const { id } = request.params;


        await knex("dish").where({ id }).delete();

        return response.json("deletado!")
    }
    async index(request, response) {
        const { user_id, ingredientes, name } = request.query;

        let dishs;

        dishs = await knex("dish")
            .where({ user_id })
            .where("ingredientes", "like", `%${ingredientes}%`)
            .where("name", "like", `%${name}%`);
        return response.json(dishs);


    }
}





module.exports = DishsController;