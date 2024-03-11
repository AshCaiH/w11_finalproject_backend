const { DataTypes } = require("sequelize");
const sequelize = require("../db/connection");

const History = sequelize.define("History", {
  day: {
    type: DataTypes.STRING,
    unique: false,
  },
  searchTerm: {
    type: DataTypes.STRING,
    unique: false,
  },
});

module.exports = History;
