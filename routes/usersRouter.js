import express from "express";
import { current, changeAvatar } from "../controllers/usersControllers.js";
import { uploadMiddleware } from "../middlewares/upload.js";

const usersRouter = express.Router();

usersRouter.get("/current", current);

usersRouter.patch("/avatar", uploadMiddleware.single("avatar"), changeAvatar);

export default usersRouter;