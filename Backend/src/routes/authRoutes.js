import { Router } from "express";
import { customerSignup, customerLogin,logout } from "../controllers/authControllers.js";

const router = Router();

router.post("/customer/signup", customerSignup);
router.post("/customer/login", customerLogin);
router.post("/logout", logout);

export default router;