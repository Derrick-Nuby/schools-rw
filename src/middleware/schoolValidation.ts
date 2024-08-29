import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import Combination from "../models/combination.js";


const schoolSchema = Joi.object({
    school_code: Joi.string()
        .required()
        .pattern(/^[0-9]{6}$/)
        .messages({
            'string.empty': 'School code is required',
            'string.pattern.base': 'School code must be exactly 6 digits',
        }),
    school_name: Joi.string()
        .required()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z0-9 ]+$'))
        .messages({
            'string.empty': 'School name is required',
            'string.min': 'School name must be at least {#limit} characters long',
            'string.pattern.base': 'School name must contain only alphanumeric characters or spaces',
        }),
    school_status: Joi.string()
        .valid('PUBLIC', 'PRIVATE', 'GOVERNMENT_AIDED')
        .required()
        .messages({
            'string.empty': 'School status is required',
            'any.only': 'School status must be either PUBLIC, PRIVATE or GOVERNMENT_AIDED',
        }),
    school_type: Joi.string()
        .valid('DAY', 'BOARDING', 'DAY & BOARDING')
        .required()
        .messages({
            'string.empty': 'School type is required',
            'any.only': 'School type must be either DAY, BOARDING, or DAY & BOARDING',
        }),
    district_name: Joi.string()
        .required()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z ]+$'))
        .messages({
            'string.empty': 'District name is required',
            'string.min': 'District name must be at least {#limit} characters long',
            'string.pattern.base': 'District name must contain only alphabetic characters or spaces',
        }),
    sector_name: Joi.string()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z ]+$'))
        .messages({
            'string.empty': 'Sector name is required',
            'string.min': 'Sector name must be at least {#limit} characters long',
            'string.pattern.base': 'Sector name must contain only alphabetic characters or spaces',
        }),
    cell_name: Joi.string()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z ]+$'))
        .messages({
            'string.empty': 'Cell name is required',
            'string.min': 'Cell name must be at least {#limit} characters long',
            'string.pattern.base': 'Cell name must contain only alphabetic characters or spaces',
        }),
    combination_ids:
        Joi.array()
            .items(Joi.string().hex().length(24))
            .required()
            .messages({
                'array.base': 'Combination IDs must be an array of valid MongoDB ObjectIDs',
                'string.length': 'Each Combination ID must be exactly 24 hexadecimal characters',
            }),
});

const schoolUpdateSchema = Joi.object({
    school_code: Joi.string()
        .pattern(/^[0-9]{6}$/)
        .messages({
            'string.empty': 'School code is required',
            'string.pattern.base': 'School code must be exactly 6 digits',
        }),
    school_name: Joi.string()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z0-9 ]+$'))
        .messages({
            'string.empty': 'School name is required',
            'string.min': 'School name must be at least {#limit} characters long',
            'string.pattern.base': 'School name must contain only alphanumeric characters or spaces',
        }),
    school_status: Joi.string()
        .valid('PUBLIC', 'PRIVATE', 'GOVERNMENT_AIDED')
        .messages({
            'string.empty': 'School status is required',
            'any.only': 'School status must be either PUBLIC, PRIVATE or GOVERNMENT_AIDED',
        }),
    school_type: Joi.string()
        .valid('DAY', 'BOARDING', 'DAY & BOARDING')
        .messages({
            'string.empty': 'School type is required',
            'any.only': 'School type must be either DAY, BOARDING, or DAY & BOARDING',
        }),
    district_name: Joi.string()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z ]+$'))
        .messages({
            'string.empty': 'District name is required',
            'string.min': 'District name must be at least {#limit} characters long',
            'string.pattern.base': 'District name must contain only alphabetic characters or spaces',
        }),
    sector_name: Joi.string()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z ]+$'))
        .messages({
            'string.empty': 'Sector name is required',
            'string.min': 'Sector name must be at least {#limit} characters long',
            'string.pattern.base': 'Sector name must contain only alphabetic characters or spaces',
        }),
    cell_name: Joi.string()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z ]+$'))
        .messages({
            'string.empty': 'Cell name is required',
            'string.min': 'Cell name must be at least {#limit} characters long',
            'string.pattern.base': 'Cell name must contain only alphabetic characters or spaces',
        }),
    combination_ids:
        Joi.array()
            .items(Joi.string().hex().length(24))
            .messages({
                'array.base': 'Combination IDs must be an array of valid MongoDB ObjectIDs',
                'string.length': 'Each Combination ID must be exactly 24 hexadecimal characters',
            }),
});

const validateSchool = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = await schoolSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join('; ');
            return res.status(400).json({ error: errorMessage });
        }

        const { combination_ids } = req.body;

        // @ts-ignore
        const invalidIds = combination_ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({ message: 'Invalid combination_ids format', invalidIds });
        }

        const combinations = await Combination.find({ '_id': { $in: combination_ids } });

        // @ts-ignore
        const existingIds = combinations.map(combination => combination._id.toString());
        // @ts-ignore
        const nonExistentIds = combination_ids.filter(id => !existingIds.includes(id));

        if (nonExistentIds.length > 0) {
            return res.status(404).json({ message: 'Some of the specified combinations do not exist', nonExistentIds });
        }

        next();
    } catch (err) {
        console.error('Error validating school data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const validateUpdateSchool = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = await schoolUpdateSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join('; ');
            return res.status(400).json({ error: errorMessage });
        }


        const { combination_ids } = req.body;

        // @ts-ignore
        const invalidIds = combination_ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({ message: 'Invalid combination_ids format', invalidIds });
        }

        const combinations = await Combination.find({ '_id': { $in: combination_ids } });

        // @ts-ignore
        const existingIds = combinations.map(combination => combination._id.toString());
        // @ts-ignore
        const nonExistentIds = combination_ids.filter(id => !existingIds.includes(id));

        if (nonExistentIds.length > 0) {
            return res.status(404).json({ message: 'Some of the specified combinations do not exist', nonExistentIds });
        }

        next();
    } catch (err) {
        console.error('Error validating school data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export { validateSchool, validateUpdateSchool };

