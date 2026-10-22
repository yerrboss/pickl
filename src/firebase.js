// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_aRDVc3tFnz_gajqT4u2H2niiHC9GRU", // 👈 '@' 제거됨
  authDomain: "pickl-54360.firebaseapp.com",
  projectId: "pickl-54360",
  storageBucket: "pickl-54360.appspot.com",
  messagingSenderId: "22623336248",
  appId: "1:22623336248:web:fo8687a8908a2c75b48cd",
  measurementId: "G-67IT69KDSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Firestore export
export const db = getFirestore(app);
export { app, analytics };