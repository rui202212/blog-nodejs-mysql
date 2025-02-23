// **Initialisation du projet**
// npm init -y
// npm install express mysql2 sequelize bcryptjs jsonwebtoken dotenv cors

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);

// Test de connexion à la base de données
/* sequelize
  .authenticate()
  .then(() => console.log("Connexion à MySQL réussie !"))
  .catch((err) => console.error("Erreur de connexion :", err));
 */
// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
