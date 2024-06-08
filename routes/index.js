import express from "express";

import authRouter from "./authRouter.js";
import contactsRouter from "./contactsRouter.js";
import usersRouter from "./usersRouter.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.use("/users", authRouter);

router.use("/users", authMiddleware, usersRouter);

router.use("/contacts", authMiddleware, contactsRouter);



export default router;