import dotenv from "dotenv";
import connectDb from "./db/index.js";
dotenv.config();

console.log("ENV:", process.env.MONGO_URI);

connectDb();