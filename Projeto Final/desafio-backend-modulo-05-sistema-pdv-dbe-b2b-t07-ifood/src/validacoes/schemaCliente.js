const joi = require("joi");

const schemaCliente = joi.object({
    nome: joi.string().required().messages({
        "any.required": "O campo nome é obrigatório",
        "string.empty": "O campo nome não pode ser vazio",
    }),

    email: joi.string().email().required().messages({
        "any.required": "O campo email é obrigatório",
        "string.empty": "O campo email não pode ser vazio",
        "string.email": "O campo email deve ser um endereço de e-mail válido",
    }),

    cpf: joi.string().length(11).required().messages({
        "any.required": "O campo cpf é obrigatório",
        "string.length": "O campo cpf deve ter 11 dígitos",
    }),

    cep: joi.string().length(8).allow(null),
    rua: joi.string().allow(null),
    numero: joi.string().allow(null),
    bairro: joi.string().allow(null),
    cidade: joi.string().allow(null),
    estado: joi.string().length(2).allow(null),
});

module.exports = schemaCliente;