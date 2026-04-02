const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./"
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/Geo-Robotics-main/",
    "<rootDir>/node_modules/"
  ]
};

module.exports = createJestConfig(customJestConfig);
