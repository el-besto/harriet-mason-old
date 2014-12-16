"use strict";

module.exports = function(sequelize, DataTypes) {
  var userDemog = sequelize.define("userDemog", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    suffix: DataTypes.STRING,
    age: DataTypes.INTEGER,
    birthday: DataTypes.DATE,
    genderPreference: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.user);
        this.hasMany(models.post, { foreignKey: 'userId', through: models.user });
      }
    }
  });

  return userDemog;
};
