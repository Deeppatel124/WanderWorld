const User = require("../models/User");

// Get logged-in user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Update logged-in user
exports.updateCurrentUser = async (req, res) => {
  try {
    const updateData = {
      username: req.body.username,
      bio: req.body.bio,
    };

    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Existing: get user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "User fetch failed" });
  }
};