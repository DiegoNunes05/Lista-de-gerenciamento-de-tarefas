import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAADLZjlfNxk80i5H-LJA01sSsUc6qsT6I",
  authDomain: "operand-test-fed0b.firebaseapp.com",
  projectId: "operand-test-fed0b",
  storageBucket: "operand-test-fed0b.appspot.com",
  messagingSenderId: "901676758618",
  appId: "1:901676758618:web:a152b55141c4996f818a63",
  measurementId: "G-6G4LSB0VMF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
signOut(auth)
export const db = getFirestore(app);