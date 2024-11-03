// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBCTGfO5CI2ymkCGWEYkvJ53M7SJ5se7cE",
    authDomain: "dental-care-7625d.firebaseapp.com",
    projectId: "dental-care-7625d",
    storageBucket: "dental-care-7625d.appspot.com",
    messagingSenderId: "946417159743",
    appId: "1:946417159743:android:09e0de1fc9f693b381328a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
