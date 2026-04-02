"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let browserApp: FirebaseApp | null = null;

export const hasFirebaseBrowserConfig = () =>
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );

export const getFirebaseBrowserApp = () => {
  if (!hasFirebaseBrowserConfig()) {
    throw new Error(
      "Firebase browser config is incomplete. Set the NEXT_PUBLIC_FIREBASE_* variables."
    );
  }

  if (!browserApp) {
    browserApp =
      getApps().find((app) => app.name === "clayportal-browser") ||
      initializeApp(firebaseConfig, "clayportal-browser");
  }
  return browserApp;
};

export const getFirebaseBrowserAuth = async () => {
  const auth = getAuth(getFirebaseBrowserApp());
  await setPersistence(auth, browserLocalPersistence);
  return auth;
};
