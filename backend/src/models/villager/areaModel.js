const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Area = sequelize.define(
  "Area",
  {
    Area_ID: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    ZipCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: "Area",
    timestamps: false,
  }
);

module.exports = Area;