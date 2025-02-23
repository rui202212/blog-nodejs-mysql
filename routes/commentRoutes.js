// Comments' CRUD

const express = require("express");
const { Comment } = require("../models");
const authenticateToken = require("../utils/tokenValidation");

const router = express.Router();

// Ajouter un commentaire (Protégé par JWT)
router.post("/posts/:postId/comment", authenticateToken, async (req, res) => {
  try {
    const { comment_text } = req.body;
    const { postId } = req.params;
    const user_id = req.user.id;

    const newComment = await Comment.create({
      post_id: postId,
      user_id,
      comment_text,
    });
    res
      .status(201)
      .json({ message: "Commentaire ajouté !", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Récupérer tous les commentaires d'un article
router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findAll({ where: { post_id: postId } });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;
