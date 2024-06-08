import User from "../models/userModel.js";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";

export const current = async (req, res, next) => {

    try {
        const authorizationHeader = req.headers.authorization;
        
        const [_, token] = authorizationHeader.split(" ", 2);

        const result = await User.findOne({ token });

        if (result === null) {
            return res.status(401).send({ message: "Not authorized" });
        }

        res.status(200).send({email: result.email, subscription: result.subscription});
    } catch (error) {
        next(error);
    }
}

export const changeAvatar = async (req, res, next) => {

    try {
        const tmpUploadPath = req.file.path;
        const img = await Jimp.read(tmpUploadPath);
        await img.resize(250, 250).writeAsync(tmpUploadPath);

        await fs.rename(req.file.path, path.resolve("public", "avatars", req.file.filename));

        const user = await User.findByIdAndUpdate(req.user.id, { avatarURL: path.resolve("avatars", req.file.filename) }, {new: true});
        
        res.status(200).send({ avatarURL: user.avatarURL });
    } catch (error) {
        next(error);
    }
}