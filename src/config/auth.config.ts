const environment = process.env.ENVIRONMENT as string;
const client_url = process.env.CLIENT_URL as string;
export const HASH_SALT_ROUNDS = 10;
export const VERIFICATION_REDIRECTING_HOST =
  environment === "production" ? client_url : "http://localhost:5173";
export const VERIFICATION_REDIRECTING_REGISTRATION_PATH =
  "auth/registration/verify";
export const VERIFICATION_REDIRECTING_RESET_PASSWORD_PATH =
  "auth/reset-password/verify";
