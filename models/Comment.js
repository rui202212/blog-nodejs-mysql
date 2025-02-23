const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define(
  "Comment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Posts", key: "id" },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    comment_text: { type: DataTypes.TEXT, allowNull: false },
  },
  { timestamps: true, tableName: "Comments" }
);

module.exports = Comment;
