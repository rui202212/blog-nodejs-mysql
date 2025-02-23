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

    return res
      .status(201)
      .json({ message: "Article créé avec succès !", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Récupérer tous les articles avec les auteurs
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Récupérer un article spécifique par ID, avec l'auteur
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });
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
    const user_id = req.user.id;

    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Article non trouvé !" });

    if (post.user_id !== user_id) {
      return res
        .status(403)
        .json({ message: "Non autorisé à modifier cet article." });
    }

    await post.update({ title, article });

    return res.json({ message: "Article mis à jour !", post });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Supprimer un article (Protégé par JWT)
router.delete("/posts/:id", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;

    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Article non trouvé !" });

    if (post.user_id !== user_id) {
      return res
        .status(403)
        .json({ message: "Non autorisé à supprimer cet article." });
    }

    await post.destroy();
    return res.json({ message: "Article supprimé !" });
  } catch (error) {
    if (error.name === "SequelizeDatabaseError") {
      return res.status(400).json({ message: "Erreur SQL", error });
    }
    return res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;
