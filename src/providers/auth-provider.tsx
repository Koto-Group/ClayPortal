"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
  type User
} from "firebase/auth";
import {
  getFirebaseBrowserAuth,
  hasFirebaseBrowserConfig
} from "@/lib/auth/firebase-browser";

type AuthBridgeContextValue = {
  user: User | null;
  ready: boolean;
  signInWithBridgeToken: (token: string) => Promise<void>;
  signOutBridge: () => Promise<void>;
};

const AuthBridgeContext = createContext<AuthBridgeContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    if (!hasFirebaseBrowserConfig()) {
      setReady(true);
      return () => undefined;
    }

    getFirebaseBrowserAuth()
      .then((auth) => {
        unsubscribe = onAuthStateChanged(auth, (nextUser) => {
          if (!active) {
            return;
          }
          setUser(nextUser);
          setReady(true);
        });
      })
      .catch((error) => {
        console.error("Failed to initialize Firebase browser auth:", error);
        setReady(true);
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const signInWithBridgeToken = useCallback(async (token: string) => {
    if (!hasFirebaseBrowserConfig()) {
      throw new Error("Firebase browser configuration is missing.");
    }
    const auth = await getFirebaseBrowserAuth();
    await signInWithCustomToken(auth, token);
  }, []);

  const signOutBridge = useCallback(async () => {
    if (!hasFirebaseBrowserConfig()) {
      return;
    }
    const auth = await getFirebaseBrowserAuth();
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      signInWithBridgeToken,
      signOutBridge
    }),
    [ready, signInWithBridgeToken, signOutBridge, user]
  );

  return (
    <AuthBridgeContext.Provider value={value}>
      {children}
    </AuthBridgeContext.Provider>
  );
}

export const useAuthBridge = () => {
  const context = useContext(AuthBridgeContext);
  if (!context) {
    throw new Error("useAuthBridge must be used inside AuthProvider.");
  }
  return context;
};
