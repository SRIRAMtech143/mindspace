import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2if8Xy3PFDYCfY10P2EaD0C3dnVolGpM",
  authDomain: "mindspace-app-d9d4c.firebaseapp.com",
  projectId: "mindspace-app-d9d4c",
  storageBucket: "mindspace-app-d9d4c.firebasestorage.app",
  messagingSenderId: "572590823048",
  appId: "1:572590823048:web:8bb4022c9ea2f8c2abf13d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);