const User = require("./model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const checkIfExists = async (type, value) => {
  const query = await User.findOne({ where: { [type]: value } });

  if (query) return true;
  else return false;
};

// SignUp
const signUp = async (req, res) => {
  try {
    if (await checkIfExists("username", req.body.username)) {
      res.status(409).json({ error: "Username already in use" });
      return;
    }

    if (await checkIfExists("email", req.body.email)) {
      res.status(409).json({ error: "Email address already in use" });
      return;
    }

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      country: req.body.country,
      town: req.body.town,
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
        email: req.authCheck.email,
        town: req.authCheck.town,
      };
      res
        .status(201)
        .json({ message: "Successfull Authentication", user: user });
      return;
    }

    const token = await jwt.sign({ id: req.user.id }, process.env.SECRET);

    const user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      country: req.user.country,
      town: req.user.town,
      token: token,
    };

    res.status(201).json({ message: "Successfull login", user: user });
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

// Update user info

const updateUser = async (req, res) => {
  console.log(Object.keys(req.body)[0]);
  try {
    if (!req.authCheck) {
      res.status(401).json({ message: "You are not Authorized to update" });
      return;
    }
    if (
      req.params.choice === "username" &&
      req.params.choice === Object.keys(req.body)[0]
    ) {
      await User.update(
        { username: req.body.username },
        {
          where: {
            username: req.authCheck.username,
          },
        }
      );
    } else if (
      req.params.choice === "email" &&
      req.params.choice === Object.keys(req.body)[0]
    ) {
      await User.update(
        { email: req.body.email },
        {
          where: {
            username: req.authCheck.username,
          },
        }
      );
    } else if (
      req.params.choice === "password" &&
      req.params.choice === Object.keys(req.body)[0]
    ) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      await User.update(
        { password: await bcrypt.hash(req.body.password, saltRounds) },
        {
          where: {
            username: req.authCheck.username,
          },
        }
      );
    } else if (
      req.params.choice === "country" &&
      req.params.choice === Object.keys(req.body)[0]
    ) {
      await User.update(
        { country: req.body.country },
        {
          where: {
            username: req.authCheck.username,
          },
        }
      );
    } else if (
      req.params.choice === "town" &&
      req.params.choice === Object.keys(req.body)[0]
    ) {
      await User.update(
        { town: req.body.town },
        {
          where: {
            username: req.authCheck.username,
          },
        }
      );
    } else {
      throw new Error("Check body or request path");
    }
    const updatedUser = await User.findOne({
      where: { id: req.authCheck.id },
    });

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

// Delete User account

const delUser = async (req, res) => {
  try {
    await User.destroy({
      where: {
        username: req.authCheck.username,
      },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

module.exports = {
  signUp: signUp,
  getUsers: getUsers,
  logIn: logIn,
  updateUser: updateUser,
  delUser: delUser,
};
