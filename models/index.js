const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

// Import des modèles
const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

// Définition des relations (associations)

// Un utilisateur peut avoir plusieurs posts
User.hasMany(Post, { foreignKey: "user_id", as: "posts" });
Post.belongsTo(User, { foreignKey: "user_id", as: "author" });

// Un utilisateur peut écrire plusieurs commentaires
User.hasMany(Comment, { foreignKey: "user_id", as: "comments" });
Comment.belongsTo(User, { foreignKey: "user_id", as: "commenter" });

// Un post peut recevoir plusieurs commentaires
Post.hasMany(Comment, { foreignKey: "post_id", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "post_id", as: "article" });

// Synchronisation des modèles avec la base de données
sequelize
  .sync({ alter: true }) // `alter: true` met à jour la structure si nécessaire
  .then(() => console.log("Base de données synchronisée avec succès !"))
  .catch((err) => console.error("Erreur de synchronisation :", err));

// Export des modèles
module.exports = { sequelize, User, Post, Comment };
