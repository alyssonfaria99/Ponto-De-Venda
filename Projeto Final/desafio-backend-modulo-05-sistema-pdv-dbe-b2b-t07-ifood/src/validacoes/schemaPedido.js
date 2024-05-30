const joi = require('joi');

const schemaProduto = joi.object({
    produto_id: joi.number().integer().required().messages({
        "any.required": "O campo pruduto_id é obrigatório",
        "number.base": "O campo produto_id deve ser um número"
    }),
    quantidade_produto: joi.number().integer().min(1).required().messages({
        "any.required": "O campo quantidade_produto é obrigatório",
        "number.base": "O campo quantidade_produto deve ser um número"
    }),
});

const schemaPedido = joi.object({
    cliente_id: joi.number().integer().required().messages({
        "any.required": "O campo cliente_id é obrigatório",
        "number.base": "O campo cliente_id deve ser um número"
    }),
    observacao: joi.string().allow(''),
    pedido_produtos: joi.array().items(schemaProduto).min(1).required(),
});

module.exports = {
    schemaPedido,
    schemaProduto
};