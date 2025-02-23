// Comments' CRUD

const express = require("express");
const { Comment, Post } = require("../models");
const authenticateToken = require("../utils/tokenValidation");

const router = express.Router();

// Ajouter un commentaire à un article (Protégé par JWT)
router.post("/posts/:postId/comment", authenticateToken, async (req, res) => {
  try {
    const { comment_text } = req.body;
    // Vérifier que le commentaire n'est pas vide
    if (!comment_text || comment_text.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Le commentaire ne peut pas être vide." });
    }

    const { postId } = req.params;
    const user_id = req.user.id;

    // Vérifier si l'article existe
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Article non trouvé !" });

    // Créer le commentaire
    const newComment = await Comment.create({
      post_id: postId,
      user_id,
      comment_text,
    });

    // Récupérer le commentaire avec l'auteur
    const fullComment = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });

    return res
      .status(201)
      .json({ message: "Commentaire ajouté !", comment: fullComment });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Récupérer tous les commentaires d'un article
router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Article non trouvé !" });

    const comments = await Comment.findAll({
      where: { post_id: postId },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Récupérer un commentaire spécifique d'un article par ID du commentaire
router.get("/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });

    if (!comment)
      return res.status(404).json({ message: "Commentaire non trouvé !" });

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Mettre à jour un commentaire (Protégé par JWT)
router.put(
  "/posts/:postId/comments/:commentId",
  authenticateToken,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const { comment_text } = req.body;
      const user_id = req.user.id;

      const post = await Post.findByPk(postId);
      if (!post)
        return res.status(404).json({ message: "Article non trouvé !" });

      const comment = await Comment.findByPk(commentId);
      if (!comment)
        return res.status(404).json({ message: "Commentaire non trouvé !" });

      // Vérifier si l'utilisateur est bien l'auteur du commentaire
      if (comment.user_id !== user_id) {
        return res
          .status(403)
          .json({ message: "Non autorisé à modifier ce commentaire. " });
      }

      await comment.update({ comment_text });

      return res.json({ message: "Commentaire mis à jour !", comment });
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur", error });
    }
  }
);

// Supprimer un commentaire (Protégé par JWT)
router.delete(
  "/posts/:postId/comments/:commentId",
  authenticateToken,
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const user_id = req.user.id;

      const comment = await Comment.findByPk(commentId);
      if (!comment)
        return res.status(404).json({ message: "Commentaire non trouvé !" });

      // Vérifier si l'utilisateur est bien l'auteur du commentaire
      if (comment.user_id !== user_id) {
        return res
          .status(403)
          .json({ message: "Non autorisé à supprimer ce commentaire. " });
      }

      await comment.destroy();

      return res.json({ message: "Commentaire supprimé !" });
    } catch (error) {
      if (error.name === "SequelizeDatabaseError") {
        return res.status(400).json({ message: "Erreur SQL", error });
      }
      return res.status(500).json({ message: "Erreur serveur", error });
    }
  }
);

module.exports = router;
