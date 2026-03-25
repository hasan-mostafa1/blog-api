const { Router } = require("express");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");

const router = Router();

// Auth
router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.get("/auth/profile", authController.showProfile);
router.put("/auth/profile-image", authController.updateProfileImage);

// Posts
router.get("/posts", postController.index);
router.get("/posts/:postId", postController.show);
router.patch("/posts/:postId/like", postController.increaseLikes);
router.patch("/posts/:postId/unLike", postController.decreaseLikes);

module.exports = router;
