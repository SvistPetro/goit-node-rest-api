import { listContact, getContactById, addContact, updateContactById, removeContact } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const result = await listContact();
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await getContactById(id);
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await removeContact(id);
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { error } = createContactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const result = await addContact(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { error } = updateContactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        if (req.body = {}) {
            throw HttpError(400, "Body must have at least one field");
        }
        const { id } = req.params;
        const result = await updateContactById(id, req.body);
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result);

    }
    catch (error) {
        next(error);
    }
};