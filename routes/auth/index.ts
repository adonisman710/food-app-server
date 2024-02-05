import { Router } from "express";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import { login, logout, register, verifyCode } from "../../controllers/auth";
import { isAuthenticated } from "../../middleware/auth";

const router = Router();
const validator = createValidator({});

const registerSchema = Joi.object({
  name: Joi.string().min(5).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

router.post("/register", validator.body(registerSchema), register);
router.post("/login", validator.body(loginSchema), login);
router.post("/verify-email", isAuthenticated, verifyCode);
router.get("/logout", isAuthenticated, logout);

export default router;
