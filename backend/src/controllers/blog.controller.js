import Blog from "../models/blog.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const buildUniqueSlug = async (title, existingId = null) => {
  const base = slugify(title) || `blog-${Date.now()}`;
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await Blog.findOne({ slug });
    if (!existing || String(existing._id) === String(existingId)) {
      return slug;
    }
    counter += 1;
    slug = `${base}-${counter}`;
  }
};

export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .select("title slug excerpt content coverImage tags authorName publishedAt createdAt updatedAt");

    return res.json(blogs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPublishedBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: "published" });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.json(blog);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ updatedAt: -1 });
    return res.json(blogs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const uploadedImage = await uploadToCloudinary(req.file, {
      folder: "stamp2fly/blogs",
    });

    return res.status(201).json({ url: uploadedImage.secure_url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, tags, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const slug = await buildUniqueSlug(title);
    const normalizedStatus = status === "published" ? "published" : "draft";

    const blog = await Blog.create({
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() || "",
      content: content.trim(),
      coverImage: coverImage?.trim() || "",
      tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
      status: normalizedStatus,
      authorId: req.user.userId,
      authorName: req.user.fullName || "Admin",
      publishedAt: normalizedStatus === "published" ? new Date() : null,
    });

    return res.status(201).json(blog);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const { title, excerpt, content, coverImage, tags, status } = req.body;

    if (typeof title === "string" && title.trim()) {
      blog.title = title.trim();
      blog.slug = await buildUniqueSlug(title, blog._id);
    }

    if (typeof excerpt === "string") {
      blog.excerpt = excerpt.trim();
    }

    if (typeof content === "string" && content.trim()) {
      blog.content = content.trim();
    }

    if (typeof coverImage === "string") {
      blog.coverImage = coverImage.trim();
    }

    if (Array.isArray(tags)) {
      blog.tags = tags.map((tag) => String(tag).trim()).filter(Boolean);
    }

    if (status === "draft" || status === "published") {
      blog.status = status;
      blog.publishedAt = status === "published" ? (blog.publishedAt || new Date()) : null;
    }

    await blog.save();

    return res.json(blog);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.deleteOne();

    return res.json({ message: "Blog deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
