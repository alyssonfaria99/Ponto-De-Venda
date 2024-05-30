const knex = require('../conexao');
const { schemaPedido, schemaProduto } = require('../validacoes/schemaPedido');
const { send } = require('../servicos/nodemailer');

const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    try {
        await schemaPedido.validateAsync({ cliente_id, observacao, pedido_produtos });

        const cliente = await knex('clientes').where('id', cliente_id).first();

        if (!cliente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }

        await Promise.all(pedido_produtos.map(produto => schemaProduto.validateAsync(produto)));

        const produtosIds = pedido_produtos.map(produto => produto.produto_id);

        const produtosNoPedido = await knex('produtos').whereIn('id', produtosIds);

        const produtoNaoEncontrado = pedido_produtos.find(
            produto => !produtosNoPedido.some(p => p.id === produto.produto_id)
        );

        if (produtoNaoEncontrado) {
            return res.status(404).json({ mensagem: `Produto com ID ${produtoNaoEncontrado.produto_id} não encontrado` });
        }

        const estoqueInsuficiente = pedido_produtos.find(produto => {
            const produtoNoPedido = produtosNoPedido.find(p => p.id === produto.produto_id);
            return produtoNoPedido.quantidade_estoque < produto.quantidade_produto;
        });

        if (estoqueInsuficiente) {
            return res.status(400).json({ mensagem: `Quantidade em estoque insuficiente para o produto com ID ${estoqueInsuficiente.produto_id}` });
        }

        const valorTotal = pedido_produtos.reduce((total, produto) => {
            const produtoNoPedido = produtosNoPedido.find(p => p.id === produto.produto_id);
            return total + produtoNoPedido.valor * produto.quantidade_produto;
        }, 0);

        const pedidoId = await knex('pedidos').insert({
            cliente_id,
            observacao,
            valor_total: valorTotal,
        }).returning('id');

        const produtosParaInserir = pedido_produtos.map(produto => {
            const produtoNoPedido = produtosNoPedido.find(p => p.id === produto.produto_id);
            return {
                pedido_id: pedidoId[0].id,
                produto_id: produto.produto_id,
                quantidade_produto: produto.quantidade_produto,
                valor_produto: produtoNoPedido.valor,
            };
        });

        await knex('pedido_produtos').insert(produtosParaInserir);

        for (const produto of pedido_produtos) {
            await knex('produtos').where('id', produto.produto_id).decrement('quantidade_estoque', produto.quantidade_produto);
        }

        const destinatario = cliente.email;
        const assunto = 'Pedido Realizado';
        const texto = `
            Seu pedido foi realizado com sucesso!
            Os produtos solicitados foram: 
            ${produtosParaInserir.map(produto => `- ID: ${produto.produto_id}, Quantidade: ${produto.quantidade_produto}`).join('\n')}
            O valor total do seu pedido é ${valorTotal}
        `;

        send(destinatario, assunto, texto);

        return res.status(201).json({ mensagem: 'Pedido cadastrado com sucesso' });
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        let query = knex('pedidos')
            .select('pedidos.id as pedido_id', 'valor_total', 'observacao', 'cliente_id')
            .leftJoin('pedido_produtos as pp', 'pedidos.id', 'pp.pedido_id');

        if (cliente_id) {
            query = query.where('cliente_id', cliente_id);

            const clienteExiste = await knex('clientes').where('id', cliente_id).first();

            if (!clienteExiste) {
                return res.status(404).json({ mensagem: 'Cliente não encontrado' });
            }
        }

        let pedidos = [];

        if (cliente_id) {
            pedidos = await knex('pedidos').where('cliente_id', '=', cliente_id);

        } else {
            pedidos = await knex('pedidos')
        }

        let pedidosFormatados = [];

        for (pedido of pedidos) {
            let pedidoProduto = await knex('pedido_produtos').where('pedido_id', '=', pedido.id);

            pedidosFormatados.push({
                pedido,
                pedidoProduto
            })
        }
        return res.status(200).json(pedidosFormatados);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};

module.exports = {
    cadastrarPedido,
    listarPedidos
};