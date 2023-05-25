import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
import "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBjWmjOBKYhsXLIB2dg_XP9gGimMEZXRuY",
  authDomain: "nuevos-horizontes-c1bf8.firebaseapp.com",
  projectId: "nuevos-horizontes-c1bf8",
  storageBucket: "nuevos-horizontes-c1bf8.appspot.com",
  messagingSenderId: "742644016189",
  appId: "1:742644016189:web:b4485f8b205d0555d5b654"
};

export const app = firebase.initializeApp(firebaseConfig);
export const analytics = firebase.analytics();
export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
