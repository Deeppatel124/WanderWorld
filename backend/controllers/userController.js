const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "User fetch failed" });
  }
};
