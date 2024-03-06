const { Router } = require("express");
const { weatherQuery } = require("./functions");

const commonRouter = Router();

commonRouter.get("/getweather",  weatherQuery);

module.exports = commonRouter;