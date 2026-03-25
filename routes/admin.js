const { Router } = require("express");
const userController = require("../controllers/admin/userController");
const postController = require("../controllers/admin/postController");
const router = Router();

// Users
router.get("/users", userController.index);
router.get("/users/:userId", userController.show);
router.delete("/users/:userId", userController.destroy);

// Posts
router.get("/posts", postController.index);
router.post("/posts", postController.store);
router.get("/posts/:postId", postController.show);
router.put("/posts/:postId", postController.update);
router.delete("/posts/:postId", postController.destroy);

module.exports = router;
