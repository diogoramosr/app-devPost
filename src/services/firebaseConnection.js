import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD1GVSrbLLPESeIEMWGmDW9M_cCL_cVqsc",
  authDomain: "devpost-4d43e.firebaseapp.com",
  projectId: "devpost-4d43e",
  storageBucket: "devpost-4d43e.appspot.com",
  messagingSenderId: "359261538354",
  appId: "1:359261538354:web:a7bddff16113863c2cd42b",
  measurementId: "G-LPCQYBYB0E",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
