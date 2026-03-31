import dotenv from "dotenv";
import connectDb from "./db/index.js";
dotenv.config();
import app from "./app.js";

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch();
