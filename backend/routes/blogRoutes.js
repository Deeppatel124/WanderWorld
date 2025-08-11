const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// ✅ Create a blog
router.post('/', authMiddleware, uploadMiddleware.single('image'), async (req, res) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.filename : null,
      user: req.userId,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// ✅ Get all blogs (for Home page)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('user', 'username');
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// ✅ Get blogs by user ID (for Profile page)
router.get('/user/:id', async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.params.id }).populate('user', 'username');
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching user blogs:', err);
    res.status(500).json({ message: 'Failed to fetch user blogs' });
  }
});

// ✅ Get a single blog by ID (for Read More)
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('user', 'username');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    console.error('Error fetching blog by ID:', err);
    res.status(500).json({ message: 'Failed to load post' });
  }
});

// ✅ Update a blog
router.put('/:id', authMiddleware, uploadMiddleware.single('image'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.user.toString() !== req.userId)
      return res.status(403).json({ message: 'Unauthorized' });

    blog.title = req.body.title || blog.title;
    blog.description = req.body.description || blog.description;
    if (req.file) blog.image = req.file.filename;

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ message: 'Failed to update blog' });
  }
});

// ✅ Delete a blog
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.user.toString() !== req.userId)
      return res.status(403).json({ message: 'Unauthorized' });

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
});

module.exports = router;
