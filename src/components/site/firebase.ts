/* eslint-disable prettier/prettier */
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
 
const firebaseConfig = {
  apiKey: "AIzaSyCxdK65TZzIKL-d97RdiE-LWpWHoYqYBvk",
  authDomain: "guicoach-2bdfc.firebaseapp.com",
  projectId: "guicoach-2bdfc",
  storageBucket: "guicoach-2bdfc.firebasestorage.app",
  messagingSenderId: "770801261287",
  appId: "1:770801261287:web:59dae3f41c56a4cd822042",
  measurementId: "G-SSB22BC0VM"
};
 
const app = initializeApp(firebaseConfig);
 
export const db      = getFirestore(app);
export const storage = getStorage(app);
export const auth    = getAuth(app);