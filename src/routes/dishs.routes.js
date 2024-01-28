const { Router } = require("express");


const DishsController = require("../controllers/DishsController");

const dishRouter = Router();

const dishsController = new DishsController();

dishRouter.get("/", dishsController.index);
dishRouter.post("/:user_id", dishsController.create);
dishRouter.get("/:id", dishsController.show);
dishRouter.delete("/:id", dishsController.delete);


module.exports = dishRouter; 