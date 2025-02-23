const { sequelize } = require("../models");

sequelize
  .authenticate()
  .then(() => console.log("Connexion à MySQL réussie !"))
  .catch((err) => console.error("Erreur de connexion :", err));
