const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ⬇️ Register
const register = async (req, res) => {
  const { username, email, password } = req.body;

  console.log("🔵 Registration payload:", { username, email, password });

  try {
    // Check for existing email (case-insensitive)
    const exist = await User.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });

    if (exist) {
      console.log(
        "🔴 Registration failed: db already exists with different case"
      );
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("✅ Registration successful");
    res
      .status(201)
      .json({ message: "Registration successful. Please login now." });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ⬇️ Login
const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("🔐 Login attempt for:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email is not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

module.exports = { register, login };
