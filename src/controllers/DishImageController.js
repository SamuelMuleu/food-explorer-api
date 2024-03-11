const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");


class DishImageController {

    async create(request, response) {
        const diskStorage = new DiskStorage();
        const id = request.dish.id;
        const imagedishFilename = request.file.filename;

        const dish = await knex("dish").where({ id }).first();
        if (!dish) {
            throw new AppError("Somente usuarios autenticados podem mudar a foto dos prato!", 401)
        }
        if (ser.imagem_path) {

            await diskStorage.deleteFile(dish.imagem_path);
        }
        const filename = await diskStorage.saveFile(imagedishFilename);
        dish.imagem_path = filename;
        await knex("dish").update(dish).where({ id });
        return response.json(dish);

    }



};

module.exports = DishImageController;