const knex = require('../conexao');
const s3 = require('../servicos/awsskd');

const cadastrarProduto = async (req, res) => {

    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { file } = req;

    try {
        if (file) {
            const arquivo = await s3.upload({
                Bucket: process.env.BACKBLAZE_BUCKET,
                Key: file.originalname,
                Body: file.buffer,
                ContentType: file.mimetype
            }).promise()
            const produto = await knex('produtos').insert({
                descricao,
                quantidade_estoque,
                valor,
                categoria_id,
                produto_imagem: arquivo.Location
            }).returning(['descricao', 'quantidade_estoque', 'valor', 'categoria_id', 'produto_imagem']);
            return res.status(201).json(produto[0]);
        }
        const produto = await knex('produtos').insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).returning(['descricao', 'quantidade_estoque', 'valor', 'categoria_id']);

        return res.status(201).json(produto);
    } catch (error) {
        return res.status(400).json({ mensagem: "Eror interno do servidor" });
    };
};

const editarProduto = async (req, res) => {
    try {
        const { id } = req.params
        const { descricao, quantidade_estoque, valor, categoria_id } = req.body
        const { file } = req

        const produtoCadastrado = await knex('produtos').select('*').where('id', id);
        if (produtoCadastrado.length === 0) {
            return res.status(404).json({ mensagem: 'Não há produto para o id informado' });
        }
        if (file) {
            const imagemURL = await knex('produtos').where('id', '=', id);
            var urlObj = new URL(imagemURL[0].produto_imagem);;
            var caminhoDaUrl = urlObj.pathname;
            caminhoDaUrl = caminhoDaUrl.replace(/^\//, '');

            await s3.deleteObject({
                Bucket: process.env.BACKBLAZE_BUCKET,
                Key: caminhoDaUrl
            }).promise()

            const arquivo = await s3.upload({
                Bucket: process.env.BACKBLAZE_BUCKET,
                Key: file.originalname,
                Body: file.buffer,
                ContentType: file.mimetype
            }).promise()
            const produtoAtualizado = await knex('produtos').update({
                descricao,
                quantidade_estoque,
                valor,
                categoria_id,
                produto_imagem: arquivo.Location
            }).where('id', id).returning(['descricao', 'quantidade_estoque', 'valor', 'categoria_id', 'produto_imagem']);


            return res.status(200).json(produtoAtualizado[0])
        }


        const produtoAtualizado = await knex('produtos').update({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).where('id', id).returning('*');


        return res.status(200).json(produtoAtualizado);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

const listarProdutos = async (req, res) => {
    const categoria_id_request = req.query.categoria_id;

    try {
        if (categoria_id_request >= 10 || categoria_id_request <= 0) {
            return res.status(404).json({ mensagem: "Essa categoria não existe" });
        }

        if (!categoria_id_request) {
            return res.status(404).json({ mensagem: "Você deve incluir o id da categoria" });
        }

        const produtos = await knex("produtos").select("*").where({ categoria_id: categoria_id_request });

        if (produtos.length === 0) {
            return res.status(404).json({ mensagem: "Nenhum produto encontrado para esta categoria" });
        };

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    };
};

const detalharProduto = async (req, res) => {
    const produto_id = req.params.id;

    try {
        const produto = await knex("produtos").select("*").where({ id: produto_id }).first();

        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};


const excluirProduto = async (req, res) => {
    const produto_id = req.params.id;

    const produtoNoPedido = await knex('pedido_produtos').select('*').where('produto_id', produto_id);

    if (produtoNoPedido.length > 0) {
        return res.status(400).json({ mensagem: 'O produto que você está tentando excluir está vinculado a um pedido' });
    }

    try {
        const produto = await knex("produtos").where({ id: produto_id }).first();

        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }

        const imagemURL = await knex('produtos').where('id', '=', produto_id);

        var urlObj = new URL(imagemURL[0].produto_imagem);;
        var caminhoDaUrl = urlObj.pathname;
        caminhoDaUrl = caminhoDaUrl.replace(/^\//, '');

        if (imagemURL[0].produto_imagem) {
            await s3.deleteObject({
                Bucket: process.env.BACKBLAZE_BUCKET,
                Key: caminhoDaUrl
            }).promise()
        }
        await knex("produtos").where({ id: produto_id }).del();

        return res.status(200).json({ message: "Produto excluído com sucesso" })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

module.exports = {
    cadastrarProduto,
    editarProduto,
    listarProdutos,
    detalharProduto,
    excluirProduto

};