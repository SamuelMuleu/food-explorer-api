const { Router } = require('express');

const usersRouter = require("./users.routes");
const dishsRouter = require("./dishs.routes");
const sessionsRouter = require("./sessions.routes");
const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/dish", dishsRouter);




module.exports = routes;
