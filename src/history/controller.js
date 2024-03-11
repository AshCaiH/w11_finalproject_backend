const History = require("./model");
const User = require("../users/model");

// addHistory
const addHistory = async (req, res) => {
  try {
    if (!req.authCheck) {
      res.status(401).json({ message: "You are not Authorized to update" });
      return;
    }
    const history = await History.create({
      day: req.body.day,
      searchTerm: req.body.searchTerm,
      UserId: req.authCheck.id,
    });
    res
      .status(201)
      .json({ message: "User history was created", history: history });
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

const getHistory = async (req, res) => {
  try {
    if (!req.authCheck) {
      res.status(401).json({ message: "You are not Authorized to update" });
      return;
    }
    console.log(req.authCheck);
    const history = await History.findAll({
      where: {
        UserId: req.authCheck.id,
      },
    });
    res.status(201).json({
      message: "User history Uploaded",
      history: history,
    });
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

module.exports = {
  addHistory: addHistory,
  getHistory: getHistory,
};
