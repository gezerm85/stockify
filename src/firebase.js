// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiM0Rw8Gv8j0xyguR8OwDgbH0jLkxPC2w",
  authDomain: "stockify-14606.firebaseapp.com",
  projectId: "stockify-14606",
  storageBucket: "stockify-14606.firebasestorage.app",
  messagingSenderId: "208258076903",
  appId: "1:208258076903:web:02ab882a68191aecb1d242",
  measurementId: "G-CSNZYEX0RG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {auth, db}