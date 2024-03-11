const { Router, request, response } = require("express");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishsController = require("../controllers/DishsController");

const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization")

const dishRouter = Router();
const upload = multer(uploadConfig.MULTER);
const dishsController = new DishsController();




dishRouter.use(ensureAuthenticated);
dishRouter.get("/:id", dishsController.show);
dishRouter.get("/", dishsController.index);
dishRouter.post("/newdish",verifyUserAuthorization(["admin"]), upload.single("imagem_path"), dishsController.create);



dishRouter.delete("/:id", verifyUserAuthorization(["admin"]),dishsController.delete);
dishRouter.put("/:id",verifyUserAuthorization(["admin"]), upload.single("imagem_path"), dishsController.update);




module.exports = dishRouter; 