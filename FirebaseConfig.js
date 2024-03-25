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
  apiKey: "AIzaSyCBoemwbCPIHqo5ioM698WFijcXh6RzizY",
  authDomain: "toothfairy-a96ca.firebaseapp.com",
  projectId: "toothfairy-a96ca",
  storageBucket: "toothfairy-a96ca.appspot.com",
  messagingSenderId: "539869846166",
  appId: "1:539869846166:web:5270550665198357a600b7",
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
