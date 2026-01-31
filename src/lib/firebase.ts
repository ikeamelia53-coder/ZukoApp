// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBowjZlolgvIob0jNlAa1yAc9ZCafDpT3o",
  authDomain: "zukoapp-2323.firebaseapp.com",
  projectId: "zukoapp-2323",
  storageBucket: "zukoapp-2323.firebasestorage.app",
  messagingSenderId: "756845549499",
  appId: "1:756845549499:web:42ee2a698be7334618569e",
  measurementId: "G-HZ1XM8VMBW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
