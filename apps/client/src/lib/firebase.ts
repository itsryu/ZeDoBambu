import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    const errorMessage = `Firebase configuration error: The environment variable for '${key}' is missing or empty in your .env.local file.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
});

let app: FirebaseApp;
let auth: Auth;
const googleProvider = new GoogleAuthProvider();

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error("Error during Firebase initialization.", error);
  throw error;
}

export { app, auth, googleProvider };