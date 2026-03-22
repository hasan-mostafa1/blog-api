const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

// Auth
router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);
router.get("/auth/profile", authController.showProfile);
router.put("/auth/profile-image", authController.updateProfileImage);

module.exports = router;
