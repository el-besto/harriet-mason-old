"use strict";

module.exports = function(sequelize, DataTypes) {
  var userDemographics = sequelize.define("userDemographics", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.user);
        // this.hasMany(models.post through userId)
      }
    }
  });

  return userDemographics;
};
