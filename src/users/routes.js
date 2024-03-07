const { Router } = require("express");

const userRouter = Router();
const { hashPass, comparePass, tokenCheck } = require("../middleware/auth");

const {
  signUp,
  getUsers,
  logIn,
  updateUser,
  delUser,
} = require("./controller");

// Sign Up
userRouter.post("/users/signUp", hashPass, signUp);

// Get users
userRouter.get("/users/getAll", getUsers);

// Log In user comparepass

userRouter.post("/users/logIn", comparePass, logIn);

// Auth check
userRouter.get("/users/authCheck", tokenCheck, logIn);

// Update user
// In body specify what You want to update
// Ex Body for update username {"update": "username", username: <new username>}
// Ex Body for update email {"update": "email", username: <new email>}
// Ex Body for update password {"update": "email", username: <new password>}
userRouter.put("/users/update", tokenCheck, updateUser);

// Delete User
// No body
userRouter.delete("/users/delUser", tokenCheck, delUser);

module.exports = userRouter;
