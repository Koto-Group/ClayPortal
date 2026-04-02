import { getApps, initializeApp, cert, getApp, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getEnvOrSecret } from "@/lib/utils/secrets";

let bootPromise: Promise<void> | null = null;

const resolveServiceAccount = async () => {
  const directJson = await getEnvOrSecret("FIREBASE_SERVICE_ACCOUNT_JSON");
  if (directJson) {
    return JSON.parse(directJson) as ServiceAccount;
  }

  const base64Json = await getEnvOrSecret("FIREBASE_SERVICE_ACCOUNT_BASE64");
  if (base64Json) {
    return JSON.parse(Buffer.from(base64Json, "base64").toString("utf8")) as ServiceAccount;
  }

  throw new Error(
    "Firebase service account credentials are missing. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_BASE64."
  );
};

export const getFirebaseAdminAuth = async () => {
  if (!getApps().length) {
    if (!bootPromise) {
      bootPromise = resolveServiceAccount().then((serviceAccount) => {
        initializeApp({
          credential: cert(serviceAccount)
        });
      });
    }

    await bootPromise;
  }

  return getAuth(getApp());
};
