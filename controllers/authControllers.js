import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userSchema } from "../schemas/userSchema.js";
import User from "../models/userModel.js";
import gravatar from "gravatar";

export const register = async (req, res, next) => {
    try {
        const { error } = userSchema.validate(req.body);

        if (error) {
            return res.status(400).send({ message: error.message });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user !== null) {
            return res.status(409).send({ "message": "Email in use" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const avatarURL = gravatar.url(email);

        const result = await User.create({ password:passwordHash, email, avatarURL });

        res.status(201).send({ user: { email: result.email, subscription: result.subscription }});
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { error } = userSchema.validate(req.body);

        if (error) {
            return res.status(400).send({ message: error.message });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user === null) {
            return res.status(401).send({ "message": "Email or password is wrong" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch === false) {
            return res.status(401).send({ "message": "Email or password is wrong" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

        await User.findByIdAndUpdate(user._id, { token }, { new: true});

        res.status(200).send({ token, user: { email: user.email, subscription: user.subscription } });

    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {

    try {
        await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });
        
        res.status(204).end();

    } catch (error) {
        next(error);
    }
}