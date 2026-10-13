import { Router } from "express";
import { customerSignup, customerLogin,logout, customerVerifyEmail,customerResendOtp } from "../controllers/authControllers.js";

const router = Router();

router.post("/customer/signup", customerSignup);
router.post("/customer/login", customerLogin);
router.post("/customer/verify-email", customerVerifyEmail);
router.post("/customer/resend-otp", customerResendOtp);
router.post("/logout", logout);

export default router;