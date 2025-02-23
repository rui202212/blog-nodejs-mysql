const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define(
  "Post",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    title: { type: DataTypes.STRING, allowNull: false },
    article: { type: DataTypes.TEXT, allowNull: false },
  },
  { timestamps: true, tableName: "Posts" }
);

module.exports = Post;
