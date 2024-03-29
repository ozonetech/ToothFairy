// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getStorage,
  ref,
  uploadString,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD3B0YjiCZj21T1ZzrFlUjQw7bNBo83Y8",
  authDomain: "toothfairy-963cf.firebaseapp.com",
  projectId: "toothfairy-963cf",
  storageBucket: "toothfairy-963cf.appspot.com",
  messagingSenderId: "233320083709",
  appId: "1:233320083709:web:638e8a0ff28c91b334ce94",
  measurementId: "G-T4HDG9M7C4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const usersRef = collection(db, "users");
export const roomRef = collection(db, "rooms");
export const FIREBASE_STORAGE = getStorage(app);
