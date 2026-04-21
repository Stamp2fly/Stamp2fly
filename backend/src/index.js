import dotenv from "dotenv";
dotenv.config();
import connectDb from "./db/index.js";
import app from "./app.js";

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch();
