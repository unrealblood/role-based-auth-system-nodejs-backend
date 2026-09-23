import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import { registerUserValidationRules } from "../middlewares/validator.middleware.js";

export const authRouter = Router();

authRouter.post("/register", registerUserValidationRules, registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);