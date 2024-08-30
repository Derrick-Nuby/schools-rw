import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';


const schoolSearchSchema = Joi.object({
  query: Joi.string()
    .optional()
    .min(2)
    .messages({
      'string.base': 'Search query must be a string',
      'string.min': 'School search must be {#limit} characters or long',
    }),
  district: Joi.alternatives().try(
    Joi.array().items(Joi.string().messages({
      'string.base': 'Each district must be a string',
    })),
    Joi.string().messages({
      'string.base': 'District must be a string',
    })
  ).optional(),
  school_status: Joi.string()
    .optional()
    .messages({
      'string.base': 'School status must be a string',
    }),
  school_type: Joi.string()
    .optional()
    .messages({
      'string.base': 'School type must be a string',
    }),
  sector_name: Joi.string()
    .optional()
    .messages({
      'string.base': 'Sector name must be a string',
    }),
  cell_name: Joi.string()
    .optional()
    .messages({
      'string.base': 'Cell name must be a string',
    }),
  combination_ids: Joi.alternatives()
    .try(
      Joi.array()
        .items(Joi.string().hex().length(24))
        .required()
        .messages({
          'array.base': 'Combination IDs must be an array of valid MongoDB ObjectIDs',
          'string.length': 'Each Combination ID must be exactly 24 hexadecimal characters',
        }),
      Joi.string().hex().length(24).messages({
        'string.length': 'Combination ID must be exactly 24 hexadecimal characters',
      })
    ).optional(),
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
    })
});


const validateSchoolSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await schoolSearchSchema.validate(req.query, { abortEarly: false });
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

export { validateSchoolSearch };
