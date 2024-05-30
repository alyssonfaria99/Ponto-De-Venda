const { error } = require("console");
const knex = require("../conexao");

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
        req.body;

    try {
        const quantidadeClientesEmail = await knex("clientes")
            .where({ email })
            .first();

        if (quantidadeClientesEmail) {
            return res.status(400).json("O email já existe");
        }

        const quantidadeClientesCPF = await knex("clientes").where({ cpf }).first();

        if (quantidadeClientesCPF) {
            return res.status(400).json("O CPF já existe");
        }

        const novoCliente = await knex("clientes")
            .insert({
                nome,
                email,
                cpf,
                cep,
                rua,
                numero,
                bairro,
                cidade,
                estado,
            })
            .returning("*");

        return res.status(201).json(novoCliente[0]);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

const editarCliente = async (req, res) => {
    const { id } = req.params;
    const { nome, cpf, email, cep, rua, numero, bairro, cidade, estado } = req.body;
    try {
        const clienteCadastrado = await knex('clientes').select('*').where('id', id);

        if (clienteCadastrado.length === 0) {
            return res.status(404).json({ mensagem: 'Não existe cliente com este id' });
        }


        const validacaoEmail = await knex('clientes').select('*').where('email', email).whereNot('id', id);

        if (validacaoEmail.length > 0) {
            return res.status(400).json({ mensagem: 'O e-mail já está sendo utilizado' });
        }


        const validacaoCpf = await knex('clientes').select('*').where('cpf', cpf).whereNot('id', id);

        if (validacaoCpf.length > 0) {
            return res.status(400).json({ mensagem: 'O CPF já está cadastrado' });
        }

        const clienteAtualizado = await knex('clientes')
            .update({
                nome,
                cpf,
                email,
                cep,
                rua,
                numero,
                bairro,
                cidade,
                estado
            })
            .where('id', id)
            .returning('*');

        return res.status(200).json(clienteAtualizado);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const listarClientes = async (req, res) => {
    try {
        const clientes = await knex("clientes").select("*");
        return res.status(200).json({ clientes });
    } catch (error) {
        return res.status(500).json({ mensagem: "Ocorreu um erro ao listar os clientes." });
    }
};

const detalharCliente = async (req, res) => {
    try {
        const clienteId = req.params.id;

        const cliente = await knex("clientes").where("id", clienteId).first();

        if (!cliente) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        } else {
            return res.status(200).json({ cliente });
        }
    } catch (error) {

        return res.status(500).json({ mensagem: "Ocorreu um erro ao detalhar o cliente." });
    }
};

module.exports = {
    cadastrarCliente,
    editarCliente,
    listarClientes,
    detalharCliente,
};
