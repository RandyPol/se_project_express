const { Joi, celebrate } = require('celebrate')
const validator = require('validator')

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value
  }
  return helpers.error('string.uri')
}

/**
 * Create validation functions from Joi schemas
 */

// The clothing item body validation when an item is created

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'The "imageUrl" field must be a valid URL',
    }),
  }),
})

// The user info body when a user is created

module.exports.validateUserInfoBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "avatar" field must be filled in',
      'string.uri': 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().min(9).messages({
      'string.min': 'The minimum length of the "password" field is 9',
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
})

// Authentication when a user logs in

module.exports.validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().min(9).messages({
      'string.min': 'The minimum length of the "password" field is 9',
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
})

// User and clothing item IDs when they are accessed

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).messages({
      'string.hex': 'The "id" field must be a valid hexadecimal',
      'string.length': 'The "id" field must be 24 characters long',
    }),
  }),
})
