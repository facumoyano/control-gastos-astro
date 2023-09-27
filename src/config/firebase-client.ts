import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const apiKey = import.meta.env.PUBLIC_API_KEY;
const authDomain = import.meta.env.PUBLIC_AUTH_DOMAIN;
const projectId = import.meta.env.PUBLIC_PROJECT_ID;
const storageBucket = import.meta.env.PUBLIC_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.PUBLIC_MESSAGING_SENDER_ID;
const appId = import.meta.env.PUBLIC_APP_ID;

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
}

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
