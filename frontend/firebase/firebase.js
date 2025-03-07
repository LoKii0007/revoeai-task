import { initializeApp } from "firebase/app";
import { getDatabase} from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyAtKZIqhL781xqpXjruMr4tziz4QG34QRY",
  authDomain: "inteview-task.firebaseapp.com",
  projectId: "inteview-task",
  storageBucket: "inteview-task.firebasestorage.app",
  messagingSenderId: "941580055557",
  appId: "1:941580055557:web:206174ed6cf1dd7353d86c",
  measurementId: "G-B3RJDBZ7BN",
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
