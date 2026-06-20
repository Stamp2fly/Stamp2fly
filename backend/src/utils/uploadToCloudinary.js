import cloudinary from "./cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "stamp2fly", ...options },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export default uploadToCloudinary;