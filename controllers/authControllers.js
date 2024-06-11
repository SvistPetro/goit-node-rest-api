import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { userSchema } from "../schemas/userSchema.js";
import { emailSchema } from "../schemas/emailSchema.js";
import User from "../models/userModel.js";
import gravatar from "gravatar";
import { sendMail } from "../mail.js";

export const register = async (req, res, next) => {
    try {
        const { error } = userSchema.validate(req.body);

        if (error) {
            return res.status(400).send({ message: error.message });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user !== null) {
            return res.status(409).send({ message: "Email in use" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomUUID();

        const avatarURL = gravatar.url(email);

        sendMail({
            to: email,
            from: "svist.petro@gmail.com",
            subject: "Welcome to Contacts book",
            html: `To confirm you email please click to <a href="http://localhost:8080/api/users/verify/${verificationToken}">link<a/>`,
            text: `To confirm you email please open the link http://localhost:8080/api/users/verify/${verificationToken}`
        })

        const result = await User.create({ password:passwordHash, email, avatarURL, verificationToken });

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
            return res.status(401).send({ message: "Email or password is wrong" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch === false) {
            return res.status(401).send({ message: "Email or password is wrong" });
        }

        if (user.verify === false) {
            return res.status(401).send({ message: "Please verify your email" });
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

export const verifyEmail = async (req, res, next) => {

    try {

        const { verificationToken } = req.params;

        const user = await User.findOne({ verificationToken });

        if (user === null) {
            return res.status(404).send({ message: "User not found" });
        }

        await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

        res.status(200).send({ message: "Verification successful" });
    } catch (error) {
        next(error);
    }
}

export const reSendEmail = async (req, res, next) => {

    try {

        const { error } = emailSchema.validate(req.body);

        if (error) {
            return res.status(400).send({ message: "Missing required field email" });
        }

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (user === null) {
            return res.status(404).send({ message: "User not found" });
        }

        if (user.verify === true) {
            return res.status(400).send({ message: "Verification has already been passed" });
        }

        sendMail({
            to: email,
            from: "svist.petro@gmail.com",
            subject: "Welcome to Contacts book",
            html: `To confirm you email please click to <a href="http://localhost:8080/api/users/verify/${user.verificationToken}">link<a/>`,
            text: `To confirm you email please open the link http://localhost:8080/api/users/verify/${user.verificationToken}`
        })

        res.status(200).send({ message: "Verification email sent" });

    } catch (error) {
        next(error);
    }
}