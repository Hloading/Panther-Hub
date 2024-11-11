// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqB_P0PubsAyLVomW_PEvZMlu1NHg93M0",
  authDomain: "panther-hub-2e47f.firebaseapp.com",
  projectId: "panther-hub-2e47f",
  storageBucket: "panther-hub-2e47f.firebasestorage.app",
  messagingSenderId: "236535049562",
  appId: "1:236535049562:web:db69e783129b46beae9763",
  measurementId: "G-113W6LVXF2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };