import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import Category from "../models/category.js";

const combinationSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z0-9 ]+$'))
        .messages({
            'string.empty': 'Combination name is required',
            'string.min': 'Combination name must be at least {#limit} characters long',
            'string.pattern.base': 'Combination name must contain only alphanumeric characters or spaces',
        }),
    abbreviation: Joi.string()
        .required()
        .max(10)
        .pattern(new RegExp('^[A-Z]+$'))
        .messages({
            'string.empty': 'Abbreviation is required',
            'string.max': 'Abbreviation must be at most {#limit} characters long',
            'string.pattern.base': 'Abbreviation must contain only uppercase letters',
        }),
    description: Joi.string()
        .allow('')
        .optional()
        .messages({
            'string.empty': 'Description can be empty or contain text',
        }),
    category_id: Joi.string()
        .required()
        .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
        .messages({
            'string.empty': 'Category ID is required',
            'string.pattern.base': 'Category ID must be a valid MongoDB ObjectID (24 hexadecimal characters)',
        }),
});

const updateCombinationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z0-9 ]+$'))
        .messages({
            'string.empty': 'Combination name is required',
            'string.min': 'Combination name must be at least {#limit} characters long',
            'string.pattern.base': 'Combination name must contain only alphanumeric characters or spaces',
        }),
    abbreviation: Joi.string()
        .max(10)
        .pattern(new RegExp('^[A-Z]+$'))
        .messages({
            'string.empty': 'Abbreviation is required',
            'string.max': 'Abbreviation must be at most {#limit} characters long',
            'string.pattern.base': 'Abbreviation must contain only uppercase letters',
        }),
    description: Joi.string()
        .allow('')
        .optional()
        .messages({
            'string.empty': 'Description can be empty or contain text',
        }),
    category_id:
        Joi.string()
            .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
            .messages({
                'string.empty': 'Category ID is required',
                'string.pattern.base': 'Category ID must be a valid MongoDB ObjectID (24 hexadecimal characters)',
            }),
});

const validateCombination = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = await combinationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join('; ');
            return res.status(400).json({ error: errorMessage });
        }

        const { category_id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(category_id)) {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }

        const category = await Category.findById(category_id);
        if (!category) {
            return res.status(404).json({ message: 'The specified category does not exist' });
        }
        next();
    } catch (err) {
        console.error('Error validating combination data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const validateUpdateCombination = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = await updateCombinationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join('; ');
            return res.status(400).json({ error: errorMessage });
        }

        const { category_id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(category_id)) {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }

        const category = await Category.findById(category_id);
        if (!category) {
            return res.status(404).json({ message: 'The specified category does not exist' });
        }
        next();
    } catch (err) {
        console.error('Error validating combination data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export { validateCombination, validateUpdateCombination };