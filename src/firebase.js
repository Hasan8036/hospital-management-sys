// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvK3oJ6KwUAmvUA5HpTuBF8UKE6sLAhaM",
  authDomain: "family-care-room-management.firebaseapp.com",
  projectId: "family-care-room-management",
  storageBucket: "family-care-room-management.firebasestorage.app",
  messagingSenderId: "277092202839",
  appId: "1:277092202839:web:e669637cfc12061314e612"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);