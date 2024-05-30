const joi = require('joi');

const schemaProduto = joi.object({
    descricao: joi.string().required().messages({
        "any.required": "O campo descricao é obrigatório",
        "string.empty": "O campo descricao não pode ser vazio",
    }),
    quantidade_estoque: joi.number().integer().min(0).required().messages({
        "any.required": "O campo quantidade_estoque é obrigatório",
        "number.base": "O campo quantidade_estoque deve ser um número",
        "number.min": "O campo quantidade_estoque deve ser maior ou igual a 0"
    }),
    valor: joi.number().positive().required().messages({
        "any.required": "O campo valor é obrigatório",
        "number.base": "O campo valor deve ser um número",
        "number.positive": "O campo valor deve ser maior que 0"
    }),
    categoria_id: joi.number().min(1).max(9).required().messages({
        "any.required": "O campo categoria_id é obrigatório",
        "number.base": "O campo categoria_id deve ser um número",
        "number.min": "A categoria não existe no banco",
        "number.max": "A categoria não existe no banco"
    }),
});

module.exports = schemaProduto;