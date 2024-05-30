const knex = require('../conexao');

const listarCategorias = async (req, res) => {
    try {
        const categorias = await knex('categorias').select('id', 'descricao');

        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

module.exports = listarCategorias