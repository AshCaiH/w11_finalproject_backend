const User = require("./model");
const jwt = require("jsonwebtoken");

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
    if (req.authCheck) {
      const user = {
        id: req.authCheck.id,
        username: req.authCheck.username,
      };
      res
        .status(201)
        .json({ message: "Successfull Authentication", user: user });
      return;
    }

    const token = await jwt.sign({ id: req.user.id }, process.env.SECRET);

    const user = {
      id: req.user.id,
      username: req.body.username,
      token: token,
    };

    res.status(201).json({ message: "Successfull Authentication", user: user });
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

module.exports = {
  signUp: signUp,
  getUsers: getUsers,
  logIn: logIn,
};
