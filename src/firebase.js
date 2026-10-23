// src/firebase.js

console.log("🔥 Loaded API Key:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log("💛 Loaded Kakao Key:", import.meta.env.VITE_KAKAO_API_KEY);

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_d8Vyc3tFzr_gxjq784v2NtiHC960U", // <--- 여기를 직접 수정!
  authDomain: "pickl-54360.firebaseapp.com",
  projectId: "pickl-54360",
  storageBucket: "pickl-54360.appspot.com",
  messagingSenderId: "226235336248",
  appId: "1:226235336248:web:fe8a687e8908a2c75b48cd",
  measurementId: "G-E71T69XQSB"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export const db = getFirestore(app);
export { app, analytics };