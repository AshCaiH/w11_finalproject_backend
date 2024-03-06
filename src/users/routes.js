const { Router } = require("express");

const userRouter = Router();

const { signUp } = require("./controller");

userRouter.post("/users/signUp", signUp);

module.exports = userRouter;
