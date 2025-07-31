// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; //  

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqFW4zKKji-8ATDRR0XO25AMrIY0ijR9w",
  authDomain: "invoice-generator-a.firebaseapp.com",
  projectId: "invoice-generator-a",
  storageBucket: "invoice-generator-a.firebasestorage.app",
  messagingSenderId: "1060550430243",
  appId: "1:1060550430243:web:f00ecb5be4698bc4716b96"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);