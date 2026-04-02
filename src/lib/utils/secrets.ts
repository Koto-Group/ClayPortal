import fs from "node:fs";
import path from "node:path";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const DEFAULT_TIMEOUT_MS = 5000;

let cachedClient: SecretManagerServiceClient | null = null;
let cachedKeyPath: string | null | undefined;
let cachedProjectIds: string[] | null = null;

const getCandidateKeyPaths = () =>
  [
    process.env.SECRET_MANAGER_KEY_PATH,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    path.resolve(process.cwd(), "secret-manager.json")
  ].filter((value): value is string => Boolean(value?.trim()));

const getSecretManagerKeyPath = () => {
  if (cachedKeyPath !== undefined) {
    return cachedKeyPath;
  }

  cachedKeyPath =
    getCandidateKeyPaths().find((candidate) => {
      try {
        return fs.existsSync(candidate);
      } catch {
        return false;
      }
    }) ?? null;

  return cachedKeyPath;
};

const getSecretManagerClient = () => {
  if (cachedClient) {
    return cachedClient;
  }

  const keyPath = getSecretManagerKeyPath();
  cachedClient = keyPath
    ? new SecretManagerServiceClient({ keyFilename: keyPath })
    : new SecretManagerServiceClient();

  return cachedClient;
};

const getProjectIds = () => {
  if (cachedProjectIds) {
    return cachedProjectIds;
  }

  const projectIds = [
    process.env.SECRET_MANAGER_PROJECT,
    process.env.GOOGLE_CLOUD_PROJECT,
    process.env.GCLOUD_PROJECT
  ]
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => value.trim());

  cachedProjectIds = [...new Set(projectIds)];
  return cachedProjectIds;
};

export const getEnvOrSecret = async (key: string) => {
  const directValue = process.env[key];
  if (directValue?.trim()) {
    return directValue;
  }

  if (process.env.APP_STATUS === "DEV") {
    return undefined;
  }

  const projectIds = getProjectIds();
  if (projectIds.length === 0) {
    return undefined;
  }

  const client = getSecretManagerClient();
  const timeoutMs = Number.parseInt(
    process.env.SECRET_MANAGER_TIMEOUT_MS || `${DEFAULT_TIMEOUT_MS}`,
    10
  );

  for (const projectId of projectIds) {
    const secretName = `projects/${projectId}/secrets/${key}/versions/latest`;
    try {
      const [version] = await Promise.race([
        client.accessSecretVersion({ name: secretName }),
        new Promise<never>((_, reject) => {
          setTimeout(
            () => reject(new Error(`Secret Manager timeout after ${timeoutMs}ms`)),
            timeoutMs
          );
        })
      ]);

      return version.payload?.data?.toString("utf8");
    } catch (error) {
      console.error(`Failed to resolve secret ${key} from ${projectId}:`, error);
    }
  }

  return undefined;
};
