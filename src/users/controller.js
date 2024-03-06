const User = require("./model");

// SignUp
const signUp = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(201).json({ message: "Craeated user", user: user });
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

// GET

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({});
    res.status(201).json({ message: `Users uploaded`, users: users });
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

const logIn = async (req, res) => {
  try {
    console.log(req.user);
    res.status(201).json({ message: "Successfull logIn", user: req.user });
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

module.exports = {
  signUp: signUp,
  getUsers: getUsers,
  logIn: logIn,
};
