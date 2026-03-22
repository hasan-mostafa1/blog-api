const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

// Auth
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/profile", authController.profile);

module.exports = router;
