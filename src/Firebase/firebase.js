// v9 compat packages are API compatible with v8 code
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfK_Fnu1XWXPACi9e3VRssrdCa4pSqwMU",
  authDomain: "clone-manohar.firebaseapp.com",
  projectId: "clone-manohar",
  storageBucket: "clone-manohar.appspot.com",
  messagingSenderId: "237741851630",
  appId: "1:237741851630:web:1da0d5578a496cbe7c44ff",
  measurementId: "G-WZP99J9D6Q",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

export { db, auth };
