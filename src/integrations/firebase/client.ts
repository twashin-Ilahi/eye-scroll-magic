import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCNKkn8PjddfMn0Scxp0K2c28feoahFtjs",
  authDomain: "naveye-af323.firebaseapp.com",
  projectId: "naveye-af323",
  storageBucket: "naveye-af323.firebasestorage.app",
  messagingSenderId: "174080377469",
  appId: "1:174080377469:web:3fe677711f2d6296e86714",
  measurementId: "G-08N83EE39D"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
