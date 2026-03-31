import express from "express";
import applicationRoutes from "./routes/application.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import countryRoutes from "./routes/country.routes.js";

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
export default app;