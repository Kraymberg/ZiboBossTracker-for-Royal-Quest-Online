
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { INITIAL_CHAT_HISTORY } from './constants';

// --- ВСТАВЬТЕ ВАШИ КЛЮЧИ НИЖЕ ---
const firebaseConfig = {
  apiKey: "",
  authDomain: ",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

// Initialize Firebase (Modular SDK)
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const migrateLocalData = async () => {
    const historyRef = collection(db, "history");
    const snapshot = await getDocs(historyRef);
    
    // Check if data already exists to prevent duplication
    if (!snapshot.empty) {
        return;
    }

    console.log("Migrating initial data...");
    for (const entry of INITIAL_CHAT_HISTORY) {
        // We remove the static ID to let Firestore generate unique IDs
        const { id, ...data } = entry; 
        await addDoc(historyRef, data);
    }
};
