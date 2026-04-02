export const getAppBaseUrl = () =>
  process.env.APP_BASE_URL ||
  process.env.NEXT_PUBLIC_APP_BASE_URL ||
  "http://localhost:3000";

export const buildAppUrl = (path: string) =>
  new URL(path, getAppBaseUrl()).toString();
