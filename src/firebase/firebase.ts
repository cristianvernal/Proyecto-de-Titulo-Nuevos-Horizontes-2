import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
import "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyD7BRKrY8n7omFje6vf_5h7lt8Uv1jiOeM",
  authDomain: "proyecto-nuevos-horizontes.firebaseapp.com",
  projectId: "proyecto-nuevos-horizontes",
  storageBucket: "proyecto-nuevos-horizontes.appspot.com",
  messagingSenderId: "204351411633",
  appId: "1:204351411633:web:3b3e95b34ed16f5c511990",
  measurementId: "G-9410TX6F6C"
};

export const app = firebase.initializeApp(firebaseConfig);
export const analytics = firebase.analytics();
export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
