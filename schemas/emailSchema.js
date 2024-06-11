import Joi from "joi";

export const emailSchema = Joi.object({
    email: Joi.string().required(),
})