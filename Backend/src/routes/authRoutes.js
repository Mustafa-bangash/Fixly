import { Router } from "express";
import {
  customerSignup,
  loginController,
  logout,
  verifyEmailController,
  resendOtpController,
  providerSignup,
  getCurrentUserController,
} from "../controllers/authControllers.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/customer/signup", customerSignup);
router.post("/customer/login",loginController("CUSTOMER"));
router.post("/customer/verify-email",verifyEmailController("CUSTOMER"));
router.post("/customer/resend-otp",resendOtpController("CUSTOMER"));

router.post("/provider/login",loginController("PROVIDER"));
router.post("/provider/resend-otp",resendOtpController("PROVIDER"));
router.post("/provider/signup", providerSignup);
router.post("/provider/verify-email",verifyEmailController("PROVIDER"));

router.post("/admin/login",loginController("ADMIN"));



router.post("/logout", logout);

router.get("/me", requireAuth, getCurrentUserController);

router.get(
  "/test/admin-only",
  requireAuth,
  requireRole("ADMIN"),
  (req, res) => {
    return res.status(200).json({
      message: "Admin access granted",
      user: req.user,
    });
  }
);

export default router;