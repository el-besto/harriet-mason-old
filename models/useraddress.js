"use strict";

module.exports = function(sequelize, DataTypes) {
  var userAddress = sequelize.define("userAddress", {
    addressType: DataTypes.STRING,
    street1: DataTypes.STRING,
    street2: DataTypes.STRING,
    street3: DataTypes.STRING,
    apt: DataTypes.STRING,
    floor: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.user);
      }
    }
  });

  return userAddress;
};
