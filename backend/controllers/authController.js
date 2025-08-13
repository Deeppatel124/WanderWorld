const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Registration
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const newUser = new User({ username, email: email.trim().toLowerCase(), password });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful. Please login.' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: 'Email is not registered' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect Password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log('🔵 Forgot password request for:', email);

  try {
    // Find user by email
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      console.log('❌ Email not found in DB');
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate token
    const token = crypto.randomBytes(20).toString('hex');
    const expire = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expire;
    await user.save();
    console.log('✅ Reset token saved:', token);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or other service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password:\n\n
      http://localhost:3000/reset-password/${token}\n\n
      This link will expire in 1 hour.`,
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Reset email sent to:', user.email);
      res.status(200).json({ message: 'Reset email sent. Check your inbox.' });
    } catch (emailErr) {
      console.error('❌ Error sending email:', emailErr.message);
      res.status(500).json({ message: 'Failed to send reset email', error: emailErr.message });
    }

  } catch (err) {
    console.error('❌ Forgot password error:', err.message);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Token is invalid or expired' });

    user.password = newPassword; // hashed automatically by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
