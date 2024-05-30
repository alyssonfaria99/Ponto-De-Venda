const joi = require('joi');

const schemaLogin = joi.object({

	email: joi.string().email().required().messages({
		'any.required': 'O campo email é obrigatório',
		'string.empty': 'O campo email é obrigatório',
	}),

	senha: joi.string().required().messages({
		'any.required': 'O campo senha é obrigatório',
		'string.empty': 'O campo senha é obrigatório',
	})
});

module.exports = schemaLogin;