"use strict";

module.exports = function(sequelize, DataTypes) {
  var post = sequelize.define("post", {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    img_url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo (models.user);
      }
    }
  });

  return post;
};
