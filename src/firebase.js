// the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqFW4zKKji-8ATDRR0XO25AMrIY0ijR9w",
  authDomain: "invoice-generator-a.firebaseapp.com",
  projectId: "invoice-generator-a",
  storageBucket: "invoice-generator-a.firebasestorage.app",
  messagingSenderId: "1060550430243",
  appId: "1:1060550430243:web:f00ecb5be4698bc4716b96"
};

//  Initialize Firebase app
const app = initializeApp(firebaseConfig);

//  Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 

//  Export services
export { app, auth, db, storage };
