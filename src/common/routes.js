const { Router } = require("express");
const { tokenCheck } = require("../middleware/auth");
const {
  weatherResponse,
  requestLocation,
  requestWeather,
} = require("./functions");

const commonRouter = Router();

commonRouter.post(
  "/getweather",
  tokenCheck,
  requestLocation,
  requestWeather,
  weatherResponse
);

module.exports = commonRouter;
