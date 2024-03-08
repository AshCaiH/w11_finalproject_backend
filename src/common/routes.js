const { Router } = require("express");
const { weatherResponse, requestLocation, requestMapImage, requestWeather } = require("./functions");

const commonRouter = Router();

commonRouter.post("/getweather", requestLocation, requestWeather, requestMapImage, weatherResponse);

module.exports = commonRouter;