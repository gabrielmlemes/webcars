import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-W5YU9JiifRL4qkb_UP3C7yiuny3tIAY",
  authDomain: "webcarros-15bbd.firebaseapp.com",
  projectId: "webcarros-15bbd",
  storageBucket: "webcarros-15bbd.appspot.com",
  messagingSenderId: "195643795421",
  appId: "1:195643795421:web:f9cc82d7c57f6bdc587834"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export {db, auth, storage}