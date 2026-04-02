const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  lines
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (!match) {
        return;
      }
      const [, key, raw] = match;
      if (process.env[key]) {
        return;
      }
      process.env[key] = raw.replace(/^['"]|['"]$/g, "");
    });
}

const shared = {
  client: "pg",
  pool: {
    min: 0,
    max: Number.parseInt(process.env.DATABASE_POOL_MAX || "5", 10)
  },
  migrations: {
    directory: "./db/migrations",
    tableName: "knex_migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const makeConnection = (hostKey) => ({
  host: process.env[hostKey] || process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl:
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : undefined,
  application_name:
    process.env.DATABASE_APPLICATION_NAME || "clayportal-knex"
});

module.exports = {
  development: {
    ...shared,
    connection: makeConnection("DATABASE_HOST")
  },
  production: {
    ...shared,
    connection: makeConnection("DATABASE_PROD_HOST")
  },
  test: {
    ...shared,
    connection: makeConnection("DATABASE_TEST_HOST")
  }
};
