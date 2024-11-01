// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
} from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // Ensure this matches your .env
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, // Ensure this matches your .env
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, // Ensure this matches your .env
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, // Ensure this matches your .env
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, // Ensure this matches your .env
  appId: process.env.REACT_APP_FIREBASE_APP_ID, // Ensure this matches your .env
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID, // Ensure this matches your .env
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");

// Authentication Functions
const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
const signInWithMicrosoft = () => signInWithPopup(auth, microsoftProvider);
const signOutUser = () => signOut(auth);

// Export necessary functions and variables
export {
  auth,
  firestore,
  signInWithGoogle,
  signInWithMicrosoft,
  signOutUser,
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
};
