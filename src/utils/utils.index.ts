import {
  VERIFICATION_REDIRECTING_HOST,
  VERIFICATION_REDIRECTING_REGISTRATION_PATH,
  VERIFICATION_REDIRECTING_RESET_PASSWORD_PATH,
} from "@/config/auth.config";

export function isVerificationTokenExpired(tokenUpdatedAt: Date) {
  const currentTime = new Date().getTime();
  const updatedAt = new Date(tokenUpdatedAt).getTime();

  return currentTime - updatedAt > 30 * 1000;
}

export function createVerificationLink(isUserVerified: boolean, token: string) {
  if (isUserVerified) {
    return `${VERIFICATION_REDIRECTING_HOST}/${VERIFICATION_REDIRECTING_RESET_PASSWORD_PATH}/${token}`;
  }
  return `${VERIFICATION_REDIRECTING_HOST}/${VERIFICATION_REDIRECTING_REGISTRATION_PATH}/${token}`;
}
