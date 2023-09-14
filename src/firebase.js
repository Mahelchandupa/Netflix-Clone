import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBHavJYPXoCs2cnUzCfQv9NfxUfmuwKtOY",
  authDomain: "movie-clone-12556.firebaseapp.com",
  projectId: "movie-clone-12556",
  storageBucket: "movie-clone-12556.appspot.com",
  messagingSenderId: "231126811678",
  appId: "1:231126811678:web:16a083041ae3d4d81b1a0f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
export const storage = getStorage(app);

