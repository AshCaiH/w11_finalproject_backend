const { Router } = require("express");
const { weatherResponse, requestLocation, requestWeather } = require("./functions");

const commonRouter = Router();

commonRouter.post("/getweather", requestLocation, requestWeather, weatherResponse);

module.exports = commonRouter;