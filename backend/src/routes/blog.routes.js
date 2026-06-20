import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogsAdmin,
  getPublishedBlogBySlug,
  getPublishedBlogs,
  uploadBlogImage,
  updateBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/", getPublishedBlogs);
router.get("/admin/all", protect, authorize("super_admin", "team"), getAllBlogsAdmin);
router.post(
  "/upload-image",
  protect,
  authorize("super_admin", "team"),
  upload.single("image"),
  uploadBlogImage
);
router.get("/:slug", getPublishedBlogBySlug);
router.post("/", protect, authorize("super_admin", "team"), createBlog);
router.put("/:id", protect, authorize("super_admin", "team"), updateBlog);
router.delete("/:id", protect, authorize("super_admin", "team"), deleteBlog);

export default router;
