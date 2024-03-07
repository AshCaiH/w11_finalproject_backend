const { Router } = require("express");

const userRouter = Router();
const { hashPass, comparePass, tokenCheck } = require("../middleware/auth");

const { signUp, getUsers, logIn } = require("./controller");

// Sign Up
userRouter.post("/users/signUp", hashPass, signUp);

// Get users
userRouter.get("/users/getAll", getUsers);

// Log In user comparepass

userRouter.post("/users/logIn", comparePass, logIn);

// Auth check
userRouter.get("/users/authCheck", tokenCheck, logIn);

module.exports = userRouter;
