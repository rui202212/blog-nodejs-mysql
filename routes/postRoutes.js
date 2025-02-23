// Posts' CRUD

const express = require("express");
const { Post } = require("../models");
const authenticateToken = require("../utils/tokenValidation");

const router = express.Router();

// Créer un article (Protégé par JWT)
router.post("/post", authenticateToken, async (req, res) => {
  try {
    const { title, article } = req.body;

    // Récupérer l'ID de l'utilisateur depuis le token
    const user_id = req.user.id;

    // Créer l'article avec user_id
    const newPost = await Post.create({ title, article, user_id });

    res
      .status(201)
      .json({ message: "Article créé avec succès !", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// la méthode suivante n'a pas inclu User_id donc erreur serveur
/* router.post("/post", authenticateToken, async (req, res) => {
  try {
    const { title, article } = req.body;
    const newPost = await Post.create({ title, article });

    res
      .status(201)
      .json({ message: "Article créé avec succès !", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}); */

// Récupérer tous les articles
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Récupérer un article par ID
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Article non trouvé !" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Mettre à jour un article (Protégé par JWT)
router.put("/posts/:id", authenticateToken, async (req, res) => {
  try {
    const { title, article } = req.body;
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Article non trouvé !" });

    await post.update({ title, article });
    res.json({ message: "Article mis à jour !", post });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Supprimer un article (Protégé par JWT)
router.delete("/posts/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Article non trouvé !" });

    await post.destroy();
    res.json({ message: "Article supprimé !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;
