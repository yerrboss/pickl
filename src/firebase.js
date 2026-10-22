// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_aRDYc3tEnz_gajqT04u2H2niiHC9GRU",
  authDomain: "pickl-54360.firebaseapp.com",
  projectId: "pickl-54360",
  storageBucket: "pickl-54360.firebasestorage.app",
  messagingSenderId: "226235336248",
  appId: "1:226235336248:web:fe8a687e8908a2c75b48cd",
  measurementId: "G-E71T69XQSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Firestore export
export const db = getFirestore(app);
export { app, analytics };