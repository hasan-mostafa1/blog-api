const { Router } = require("express");
const userController = require("../controllers/admin/userController");
const router = Router();

// Users
router.get("/users", userController.index);
router.get("/users/:userId", userController.show);
router.delete("/users/:userId", userController.destroy);

module.exports = router;
