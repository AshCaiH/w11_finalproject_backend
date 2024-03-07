const User = require("./model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

// Log In
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

    res.status(201).json({ message: "Successfull login", user: user });
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

// Update user info

const updateUser = async (req, res) => {
  try {
    if (!req.authCheck) {
      res.staus(401).json({ message: "You are not Authorized to update" });
      return;
    }
    if (req.body.update === "username") {
      await User.update(
        { username: req.body.username },
        {
          where: {
            username: req.authCheck.username,
          },
        }
      );
    } else if (req.body.update === "email") {
      await User.update(
        { email: req.body.email },
        {
          where: {
            username: req.authCheck.username,
          },
        }
      );
    } else if (req.body.update === "password") {
      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      await User.update(
        { password: await bcrypt.hash(req.body.password, saltRounds) },
        {
          where: {
            username: req.authCheck.username,
          },
        }
      );
    } else {
      throw new Error("Check body");
    }
    const updatedUser = await User.findOne({
      where: { username: req.authCheck.username },
    });

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

// Delete Uuser

module.exports = {
  signUp: signUp,
  getUsers: getUsers,
  logIn: logIn,
  updateUser: updateUser,
};
