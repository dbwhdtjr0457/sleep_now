import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvTPXobMPNNnnSH34wJsm-T0G4NexyYJw",
  authDomain: "sleepnow-3ffac.firebaseapp.com",
  databaseURL: "https://sleepnow-3ffac-default-rtdb.firebaseio.com",
  projectId: "sleepnow-3ffac",
  storageBucket: "sleepnow-3ffac.appspot.com",
  messagingSenderId: "515961940311",
  appId: "1:515961940311:web:0e4ffc6996cda2bfc83612",
  measurementId: "G-NQF3NPF5R2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const createUser = createUserWithEmailAndPassword;
export const signInUser = signInWithEmailAndPassword;
export const signOutUser = signOut;
