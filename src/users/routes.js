const { Router } = require("express");

const userRouter = Router();
const { hashPass, comparePass } = require("../middleware/auth");

const { signUp, getUsers, logIn } = require("./controller");

// Sign Up
userRouter.post("/users/signUp", hashPass, signUp);

// Get users
userRouter.get("/users/getAll", getUsers);

// Log In user comparepass

userRouter.post("/users/logIn", comparePass, logIn);

module.exports = userRouter;
