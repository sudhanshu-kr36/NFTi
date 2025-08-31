// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import 'firebase/compat/database';

const firebaseConfig = {
  databaseURL: "https://nft-ticketing-database-default-rtdb.firebaseio.com",
  apiKey: "AIzaSyCDrvWE8iHD-8zZv-Gc1C4qeWjxTW7mLKM",
  authDomain: "nft-ticketing-database.firebaseapp.com",
  projectId: "nft-ticketing-database",
  storageBucket: "nft-ticketing-database.firebasestorage.app",
  messagingSenderId: "410668005496",
  appId: "1:410668005496:web:bcd952847490756c4e558d",
  measurementId: "G-2CQSHZQS5T"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const db= firebase.database();