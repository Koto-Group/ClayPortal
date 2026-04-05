const fs = require("fs");
const path = require("path");
const knex = require("knex");
const {
  initializeApp,
  getApps,
  cert,
  applicationDefault
} = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const knexConfig = require("../knexfile");

const envPath = path.resolve(__dirname, "..", ".env");
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
      if (!process.env[key]) {
        process.env[key] = raw.replace(/^['"]|['"]$/g, "");
      }
    });
}

const resolveServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return {
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
    };
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    return {
      credential: cert(
        JSON.parse(
          Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString(
            "utf8"
          )
        )
      )
    };
  }

  return {
    credential: applicationDefault()
  };
};

const bootstrap = async () => {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const fullName = process.env.BOOTSTRAP_ADMIN_NAME || "Platform Admin";

  if (!email || !password) {
    throw new Error(
      "Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD before running the bootstrap script."
    );
  }

  if (!getApps().length) {
    initializeApp(resolveServiceAccount());
  }

  const auth = getAuth();
  let authUser;

  try {
    authUser = await auth.getUserByEmail(email);
    await auth.updateUser(authUser.uid, {
      password,
      displayName: fullName
    });
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      authUser = await auth.createUser({
        email,
        password,
        displayName: fullName
      });
    } else {
      throw error;
    }
  }

  const environment =
    process.env.NODE_ENV === "production" ? "production" : "development";
  const db = knex(knexConfig[environment]);

  try {
    const existing = await db("users")
      .whereRaw("lower(email) = ?", [email.toLowerCase()])
      .first();

    if (existing) {
      await db("users").where({ id: existing.id }).update({
        full_name: fullName,
        firebase_uid: authUser.uid,
        role: "platform_admin",
        company_id: null,
        invite_status: "active",
        updated_at: db.fn.now()
      });
      console.log(`Updated platform admin ${email}`);
    } else {
      await db("users").insert({
        email: email.toLowerCase(),
        full_name: fullName,
        firebase_uid: authUser.uid,
        role: "platform_admin",
        company_id: null,
        invite_status: "active"
      });
      console.log(`Created platform admin ${email}`);
    }
  } finally {
    await db.destroy();
  }
};

bootstrap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
