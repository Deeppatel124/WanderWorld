const express = require("express");
const router = express.Router();

const {
  getUser,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/userController");

const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/authMiddleware");

// Logged-in user
router.get("/me", verifyToken, getCurrentUser);

router.put(
  "/me",
  verifyToken,
  upload.single("image"),
  updateCurrentUser
);

// Public profile
router.get("/:id", getUser);

module.exports = router;