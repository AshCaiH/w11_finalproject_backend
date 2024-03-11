const { Router } = require("express");
const { tokenCheck } = require("../middleware/auth");

const {
  weatherResponse,
  requestLocation,
  requestMapImage,
  requestWeather,
} = require("./functions");

const {tokenCheck} = require("../middleware/auth");

const commonRouter = Router();

commonRouter.post(
  "/getweather",
  tokenCheck,
  requestLocation,
  requestWeather,
  requestMapImage,
  weatherResponse
);

module.exports = commonRouter;
