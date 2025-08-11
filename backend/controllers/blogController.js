const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;

    const blog = new Blog({
      title,
      description,
      user: req.userId,
      image: req.file?.filename || "",
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error("Create blog error:", err);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("user", "username");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "user",
      "username"
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.user.toString() !== req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    blog.title = req.body.title || blog.title;
    blog.description = req.body.description || blog.description;
    if (req.file) {
      blog.image = req.file.filename;
    }

    await blog.save();
    res.json({ message: "Blog updated successfully", blog });
  } catch (err) {
    res.status(500).json({ message: "Failed to update the Blog." });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.user.toString() !== req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete blog" });
  }
};
