import { Router } from "express";
import { customerSignup, loginController,logout, verifyEmailController,resendOtpController,
    providerSignup
 } from "../controllers/authControllers.js";

const router = Router();

router.post("/customer/signup", customerSignup);
router.post(
  "/customer/login",
  loginController("CUSTOMER")
);

router.post(
  "/provider/login",
  loginController("PROVIDER")
);

router.post(
  "/customer/resend-otp",
  resendOtpController("CUSTOMER")
);

router.post(
  "/provider/resend-otp",
  resendOtpController("PROVIDER")
);
router.post("/provider/signup", providerSignup);
router.post(
  "/customer/verify-email",
  verifyEmailController("CUSTOMER")
);

router.post(
  "/provider/verify-email",
  verifyEmailController("PROVIDER")
);
router.post("/logout", logout);

export default router;