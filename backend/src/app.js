import express from "express";
import cors from "cors";
import applicationRoutes from "./routes/application.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import checklistRoutes from "./routes/checklist.routes.js";
import countryRoutes from "./routes/country.routes.js";
import authRoutes from "./routes/auth.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import applicationFieldRoutes from "./routes/applicationField.routes.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is working");
});

// Application routes
app.use("/api/applications", applicationRoutes);

// Admin routes
app.use("/api/admin", adminRoutes)

// country routes
app.use("/api/countries", countryRoutes);

// checklist routes
app.use("/api/checklist", checklistRoutes);

// auth routes
app.use("/api/auth", authRoutes);

// faq routes
app.use("/api/faqs", faqRoutes);

// blog routes
app.use("/api/blogs", blogRoutes);

// dynamic application field routes
app.use("/api/application-fields", applicationFieldRoutes);

export default app;