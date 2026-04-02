import type { Knex } from "knex";
import { getEnvOrSecret } from "@/lib/utils/secrets";

let connection: Knex | null = null;
let pendingConnection: Promise<Knex> | null = null;

const getKnexFactory = (): typeof import("knex").default => {
  const runtimeRequire = new Function("moduleName", "return require(moduleName);");
  return runtimeRequire("knex");
};

const getPoolMax = () =>
  Number.parseInt(process.env.DATABASE_POOL_MAX || "5", 10);

const resolveSsl = () =>
  process.env.DATABASE_SSL === "true"
    ? { rejectUnauthorized: false }
    : undefined;

const buildConnection = async () => {
  const [user, password, database, prodHost] = await Promise.all([
    getEnvOrSecret("DATABASE_USERNAME"),
    getEnvOrSecret("DATABASE_PASSWORD"),
    getEnvOrSecret("DATABASE_NAME"),
    getEnvOrSecret("DATABASE_PROD_HOST")
  ]);

  const host =
    process.env.APP_STATUS === "DEV"
      ? process.env.DATABASE_HOST
      : prodHost || process.env.DATABASE_HOST;

  if (!host || !user || !database) {
    throw new Error(
      "Database configuration is incomplete. Set DATABASE_HOST, DATABASE_USERNAME, and DATABASE_NAME."
    );
  }

  return getKnexFactory()({
    client: "pg",
    pool: {
      min: 0,
      max: getPoolMax()
    },
    connection: {
      host,
      user,
      password,
      database,
      ssl: resolveSsl(),
      application_name:
        process.env.DATABASE_APPLICATION_NAME || "clayportal-web"
    }
  });
};

export const getDb = async () => {
  if (connection) {
    return connection;
  }

  if (pendingConnection) {
    return pendingConnection;
  }

  pendingConnection = buildConnection().then((instance) => {
    connection = instance;
    return instance;
  });

  try {
    return await pendingConnection;
  } finally {
    pendingConnection = null;
  }
};
