const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");


router.get("/posts", postController.getPosts);
router.get("/posts/:id", postController.getPostById);
router.put("/posts/:id", postController.updatePost);
router.post("/posts", postController.createPost);
router.delete("/posts/:id", postController.deletePost);

module.exports = router;