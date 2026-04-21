import admin from "firebase-admin";
import { readFileSync } from "fs";

// Check if already initialized to prevent errors during hot-reloads
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    readFileSync(new URL("../../serviceAccountKey.json", import.meta.url))
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://your-project-id.firebaseio.com" // Only if using Realtime DB
  });
  console.log("✅ Firebase Admin Initialized");
}

export default admin;