const { Router } = require("express");
const { weatherQuery } = require("./functions");

const commonRouter = Router();

commonRouter.post("/getweather",  weatherQuery);

module.exports = commonRouter;