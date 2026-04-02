const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");

const getMachineArch = () => {
  try {
    return execSync("uname -m", { cwd: projectRoot, stdio: ["ignore", "pipe", "ignore"] })
      .toString("utf8")
      .trim();
  } catch {
    return process.arch;
  }
};

const getInstalledSwcPackages = () => {
  const nextDir = path.join(projectRoot, "node_modules", "@next");
  if (!fs.existsSync(nextDir)) {
    return [];
  }

  return fs
    .readdirSync(nextDir)
    .filter((entry) => entry.startsWith("swc-"))
    .map((entry) => `@next/${entry}`)
    .sort();
};

const platform = process.platform;
const arch = process.arch;
const machineArch = getMachineArch();
const installedSwcPackages = getInstalledSwcPackages();

const expectedSwcPackageByPlatform = {
  darwin: {
    arm64: "@next/swc-darwin-arm64",
    x64: "@next/swc-darwin-x64"
  },
  linux: {
    arm64: "@next/swc-linux-arm64-gnu",
    x64: "@next/swc-linux-x64-gnu"
  },
  win32: {
    arm64: "@next/swc-win32-arm64-msvc",
    x64: "@next/swc-win32-x64-msvc"
  }
};

const expectedSwcPackage = expectedSwcPackageByPlatform[platform]?.[arch];

if (typeof process.getuid === "function" && process.getuid() === 0) {
  console.error("");
  console.error("ClayPortal should not be run with sudo.");
  console.error("Run npm scripts as your normal user so the Node architecture and installed Next SWC binary stay aligned.");
  console.error("");
  process.exit(1);
}

if (expectedSwcPackage && installedSwcPackages.length > 0) {
  const hasExpectedSwcPackage = installedSwcPackages.includes(expectedSwcPackage);

  if (!hasExpectedSwcPackage) {
    console.error("");
    console.error(
      `Missing ${expectedSwcPackage} for the current runtime (${platform} ${arch}).`
    );
    console.error(
      `Installed Next SWC packages: ${installedSwcPackages.join(", ") || "none"}`
    );
    console.error("");
    console.error(
      "This usually means node_modules was installed under a different Node architecture."
    );
    console.error("Fix:");
    console.error("  1. Do not use sudo for npm scripts.");
    console.error(
      "  2. Remove node_modules and reinstall with the same Node architecture you will run with."
    );
    console.error(
      "     rm -rf node_modules .next .next-build .next-dev"
    );
    console.error("     npm install");
    console.error("     npm run dev");
    console.error("");
    process.exit(1);
  }
}

if (platform === "darwin" && machineArch === "arm64" && arch === "x64") {
  console.warn("");
  console.warn(
    "Warning: Node is running under Rosetta (x64) on an Apple Silicon machine."
  );
  console.warn(
    "This will work if you keep node_modules installed under x64, but the recommended setup is native arm64 Node."
  );
  console.warn("");
}
