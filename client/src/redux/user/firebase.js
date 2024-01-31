// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-a4ea6.firebaseapp.com",
  projectId: "mern-estate-a4ea6",
  storageBucket: "mern-estate-a4ea6.appspot.com",
  messagingSenderId: "950347279450",
  appId: "1:950347279450:web:40daf016eca992ba703c63"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);