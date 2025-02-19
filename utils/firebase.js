// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,collection, addDoc, deleteDoc, doc, getDocs, query, where, getDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "Your apiKey",
  authDomain: "Your authDomain",
  projectId: "Your projectId",
  storageBucket: "Your storageBucket",
  messagingSenderId: "Your messagingSenderId",
  appId: "Your appId"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
export { collection, addDoc, deleteDoc, doc, getDocs, query, where, getDoc, updateDoc, arrayUnion, arrayRemove }; // Export