const { Router } = require("express");
const historyRouter = Router();

const { addHistory, getHistory } = require("./controller");
const { tokenCheck } = require("../middleware/auth");

// addHistory
historyRouter.post("/history/addHistory", tokenCheck, addHistory);

// getHistory

historyRouter.get("/history/getHistory", tokenCheck, getHistory);

module.exports = historyRouter;
