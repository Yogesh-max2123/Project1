// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDogUU7VcfkFcEx7HUVZeVXCYT_2HX08eg",
  authDomain: "ai-trip-planner-5db2a.firebaseapp.com",
  projectId: "ai-trip-planner-5db2a",
  storageBucket: "ai-trip-planner-5db2a.firebasestorage.app",
  messagingSenderId: "477374648625",
  appId: "1:477374648625:web:faa1dc6ab54795991d2010",
  measurementId: "G-QKVFKYR5HX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
