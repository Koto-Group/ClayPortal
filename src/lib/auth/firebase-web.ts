import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, inMemoryPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let serverApp: FirebaseApp | null = null;

const hasFirebaseConfig = () =>
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );

export const getFirebaseWebApp = () => {
  if (!hasFirebaseConfig()) {
    throw new Error(
      "Firebase web config is incomplete. Set the NEXT_PUBLIC_FIREBASE_* variables."
    );
  }

  if (!serverApp) {
    serverApp =
      getApps().find((app) => app.name === "clayportal-server") ||
      initializeApp(firebaseConfig, "clayportal-server");
  }

  return serverApp;
};

export const verifyEmailPassword = async (email: string, password: string) => {
  const auth = getAuth(getFirebaseWebApp());
  await setPersistence(auth, inMemoryPersistence);
  return signInWithEmailAndPassword(auth, email, password);
};
