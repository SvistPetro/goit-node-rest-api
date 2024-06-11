import express from "express";
import { register, login, logout, verifyEmail, reSendEmail } from "../controllers/authControllers.js";
import { authMiddleware } from "../middlewares/auth.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post("/register", jsonParser, register);

authRouter.post("/login", jsonParser, login);

authRouter.post("/logout", authMiddleware, logout);

authRouter.get("/verify/:verificationToken", verifyEmail);

authRouter.post("/verify", jsonParser, reSendEmail);

export default authRouter;