import {
  getApps,
  initializeApp,
  cert,
  applicationDefault,
  getApp,
  type AppOptions,
  type ServiceAccount
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getEnvOrSecret } from "@/lib/utils/secrets";

let bootPromise: Promise<void> | null = null;

const resolveFirebaseAdminOptions = async (): Promise<AppOptions> => {
  const directJson = await getEnvOrSecret("FIREBASE_SERVICE_ACCOUNT_JSON");
  if (directJson) {
    return {
      credential: cert(JSON.parse(directJson) as ServiceAccount)
    };
  }

  const base64Json = await getEnvOrSecret("FIREBASE_SERVICE_ACCOUNT_BASE64");
  if (base64Json) {
    return {
      credential: cert(
        JSON.parse(
          Buffer.from(base64Json, "base64").toString("utf8")
        ) as ServiceAccount
      )
    };
  }

  return {
    credential: applicationDefault()
  };
};

export const getFirebaseAdminAuth = async () => {
  if (!getApps().length) {
    if (!bootPromise) {
      bootPromise = resolveFirebaseAdminOptions().then((options) => {
        initializeApp(options);
      });
    }

    await bootPromise;
  }

  return getAuth(getApp());
};
