import { createContactSchema, updateContactSchema, updateContactFavoriteSchema } from "../schemas/contactsSchemas.js";
import Contact from "../models/contactModel.js";

export const getAllContacts = async (req, res, next) => {

    try {
        const result = await Contact.find({ owner: req.user.id});
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (id.length !== 24) {
            return res.status(404).send({ message: "Not found" });
        }

        const result = await Contact.findById(id);

        if (result === null) {
            return res.status(404).send({ message: "Not found" });
        }

        if (result.owner.toString() !== req.user.id) {
            console.log(req.user.id);
            return res.status(404).send({ message: "Not found" });
        }

        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (id.length !== 24) {
            return res.status(404).send({ message: "Not found" });
        }

        const searchContact = await Contact.findOne({ _id: id, owner: req.user.id });

        if (searchContact === null) {
            return res.status(404).send({ message: "Not found" });
        }

        const result = await Contact.findByIdAndDelete(id);

        if (result === null) {
            return res.status(404).send({ message: "Not found" });
        }

        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { error } = createContactSchema.validate(req.body);

        if (error) {
            return res.status(400).send({ message: error.message });
        }

        const contact = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            owner: req.user.id
        }

        const result = await Contact.create(contact);

        res.status(201).send(result);
    }
    catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { error } = updateContactSchema.validate(req.body);

        if (error) {
            return res.status(400).send({ message: error.message });
        }

        const contact = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        }

        const { id } = req.params;

        if (id.length !== 24) {
            return res.status(404).send({ message: "Not found" });
        }

        const searchContact = await Contact.findOne({ _id: id, owner: req.user.id });

        if (searchContact === null) {
            return res.status(404).send({ message: "Not found" });
        }

        const result = await Contact.findByIdAndUpdate(id, contact, { new: true });

        if (result === null) {
            return res.status(404).send({ message: "Not found" });
        }

        res.status(200).json(result);

    }
    catch (error) {
        next(error);
    }
};

export const updateStatusContact = async (req, res, next) => {
    try {
        const { error } = updateContactFavoriteSchema.validate(req.body);

        if (error) {
            return res.status(400).send({ message: error.message });
        }

        const favorite = {
            favorite: req.body.favorite,
        }

        const { id } = req.params;

        if (id.length !== 24) {
            return res.status(404).send({ message: "Not found" });
        }

        const searchContact = await Contact.findOne({ _id: id, owner: req.user.id });

        if (searchContact === null) {
            return res.status(404).send({ message: "Not found" });
        }

        const result = await Contact.findByIdAndUpdate(id, favorite, { new: true });

        if (result === null) {
            return res.status(404).send({ message: "Not found" });
        }
        res.status(200).send(result);

    }
    catch (error) {
        next(error);
    }
};