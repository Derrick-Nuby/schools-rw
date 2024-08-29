import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const applicableGradeSchema = Joi.object({
    grade: Joi.string()
        .required()
        .pattern(new RegExp('^[A-Za-z0-9]+$'))
        .messages({
            'string.empty': 'Grade is required',
            'string.pattern.base': 'Grade must contain only alphanumeric characters without spaces',
        }),
    description: Joi.string()
        .required()
        .min(10)
        .messages({
            'string.empty': 'Description is required',
            'string.min': 'Description must be at least {#limit} characters long',
        }),
});

const categorySchema = Joi.object({
    name: Joi.string()
        .required()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z0-9 -]+$'))
        .messages({
            'string.empty': 'Category name is required',
            'string.min': 'Category name must be at least {#limit} characters long',
            'string.pattern.base': 'Category name must contain only alphanumeric characters or spaces',
        }),
    description: Joi.string()
        .allow('')
        .optional()
        .messages({
            'string.empty': 'Description can be empty or contain text',
        }),
    applicable_grades: Joi.array()
        .items(applicableGradeSchema)
        .min(1)
        .required()
        .messages({
            'array.base': 'Applicable grades must be an array',
            'array.min': 'At least one grade must be specified',
        }),
});

const updateCategorySchema = Joi.object({
    name: Joi.string()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z0-9 -]+$'))
        .messages({
            'string.empty': 'Category name is required',
            'string.min': 'Category name must be at least {#limit} characters long',
            'string.pattern.base': 'Category name must contain only alphanumeric characters or spaces',
        }),
    description: Joi.string()
        .allow('')
        .optional()
        .messages({
            'string.empty': 'Description can be empty or contain text',
        }),
    applicable_grades: Joi.array()
        .items(applicableGradeSchema)
        .min(1)
        .messages({
            'array.base': 'Applicable grades must be an array',
            'array.min': 'At least one grade must be specified',
        }),
});

const validateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = await categorySchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join('; ');
            return res.status(400).json({ error: errorMessage });
        }
        next();
    } catch (err) {
        console.error('Error validating category data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const validateUpdateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = await updateCategorySchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join('; ');
            return res.status(400).json({ error: errorMessage });
        }
        next();
    } catch (err) {
        console.error('Error validating category data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { validateCategory, validateUpdateCategory };
