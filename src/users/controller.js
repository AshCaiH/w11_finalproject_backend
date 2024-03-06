const User = require("./model");

const signUp = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(201).json({ message: "Craeated user", user: user });
  } catch (error) {
    res.status(501).jason({ message: message, error: error });
  }
};

module.exports = {
  signUp: signUp,
};
