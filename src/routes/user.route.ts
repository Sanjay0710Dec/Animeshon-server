import { Router } from "express";
import {
  AuthenitcateUser,
  checkIfUserExist,
  verifyEmailForRegistrationAndPasswordReset,
} from "@/middlewares/user.middleware";
import {
  giveSignedUrlToUpload,
  updateUserBanner,
  updateUserProfile,
} from "@/controllers/user/profile.controller";
import { registerUser } from "@/controllers/user/auth.controller";
import userFeedBackAndSuggestion from "@/controllers/user/feedback.controller";

const userRouter = Router();
userRouter.route("/signup").post(checkIfUserExist, registerUser);
userRouter
  .route("/verify-email/registration-password-reset/:verificationId")
  .post(verifyEmailForRegistrationAndPasswordReset);
userRouter.route("/S3signedUrl").get(AuthenitcateUser, giveSignedUrlToUpload);
userRouter.route("/update-profile").patch(AuthenitcateUser, updateUserProfile);
userRouter.route("/update-banner").patch(AuthenitcateUser, updateUserBanner);

userRouter.route("/feedback-suggestion").post(userFeedBackAndSuggestion);
export default userRouter;
