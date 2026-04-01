import express from "express";
import applicationRoutes from "./routes/application.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import checklistRoutes from "./routes/checklist.routes.js";
import countryRoutes from "./routes/country.routes.js";
import authRoutes from "./routes/auth.routes.js";


const app = express();

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

export default app;