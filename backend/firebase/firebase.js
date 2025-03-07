import admin from "firebase-admin";
import serviceAccount from "../google-service-account.json" assert { type: "json" }; // Your Firebase key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://inteview-task.firebaseio.com",
});

export const db = admin.database();
