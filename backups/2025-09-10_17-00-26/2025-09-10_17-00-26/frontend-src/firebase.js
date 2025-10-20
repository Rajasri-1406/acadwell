// src/firebase.js

// Import required Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ Firebase configuration for your project
const firebaseConfig = {
  apiKey: "AIzaSyBIqbYcnKbDuT4CrnrcSvrp5hugwHZUyFo",
  authDomain: "acadwell-20b01.firebaseapp.com",
  projectId: "acadwell-20b01",
  storageBucket: "acadwell-20b01.appspot.com",  // ✅ Fixed storage bucket URL
  messagingSenderId: "512176185375",
  appId: "1:512176185375:web:6f5696c26d9a06b6a1b52a",
  measurementId: "G-50JE8QKLLT"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore for real-time chat database
export const db = getFirestore(app);

// ✅ Initialize Firebase Authentication (optional if needed later)
export const auth = getAuth(app);
