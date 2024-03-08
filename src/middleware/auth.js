const bcrypt = require("bcrypt");
const User = require("../users/model");
const jwt = require("jsonwebtoken");

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const hashPass = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;
    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

const comparePass = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username },
    });

    if (!user) {
      res.status(404).json({ error: "User does not exist." });
      return;
    }

    const myPassword = user.dataValues.password;
    const checkPassword = await bcrypt.compare(req.body.password, myPassword);
    if (!checkPassword) {
      res.status(401).json({ error: "Incorrect password. Please try again." });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

const tokenCheck = async (req, res, next) => {
  try {
    console.log(req.header("Authorization"));
    if (!req.header("Authorization")) {
      throw new Error("No acces");
    }

    const token = req.header("Authorization").replace("Bearer ", "");

    const decodeToken = await jwt.verify(token, process.env.SECRET);

    const user = await User.findOne({ where: { id: decodeToken.id } });

    if (!user) {
      res.status(401).json({ message: "Not Authorized" });
      return;
    }
    req.authCheck = user;

    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

module.exports = {
  hashPass: hashPass,
  comparePass: comparePass,
  tokenCheck: tokenCheck,
};
