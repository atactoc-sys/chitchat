import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2ouVGOTVofb6OFVYusnMCdaNkuv96sYU",
  authDomain: "chitchat-b1b3c.firebaseapp.com",
  projectId: "chitchat-b1b3c",
  storageBucket: "chitchat-b1b3c.appspot.com",
  messagingSenderId: "745180830192",
  appId: "1:745180830192:web:56f87f8a9db8967340a535",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
