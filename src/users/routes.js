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
// Ex Body for update username {username: <new username>} and  path: /users/update/username
// Ex Body for update email {email: <new email>} and  path: /users/update/email
// Ex Body for update password {password: <new password>} and  path: /users/update/password

userRouter.put("/users/update/:choice", tokenCheck, updateUser);
// Delete User
// No body
userRouter.delete("/users/delUser", tokenCheck, delUser);

module.exports = userRouter;
