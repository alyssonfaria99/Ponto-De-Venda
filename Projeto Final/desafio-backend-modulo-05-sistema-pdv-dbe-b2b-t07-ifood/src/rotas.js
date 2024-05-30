const express = require("express");
const { cadastrarUsuario, login, detalharUsuario, editarPerfilUsuarioLogado } = require("./controladores/usuarios");
const schemaUsuario = require("./validacoes/schemaUsuario");
const schemaLogin = require("./validacoes/schemaLogin");
const schemaProduto = require("./validacoes/schemaProduto");
const schemaCliente = require("./validacoes/schemaCliente");
const validarCorpoRequisicao = require("./intermediarios/validarCorpoRequisicao");
const listarCategorias = require("./controladores/categorias");
const verificarUsuarioLogado = require("./intermediarios/autenticacao");
const { cadastrarProduto, editarProduto, listarProdutos, detalharProduto, excluirProduto } = require("./controladores/produtos");
const { cadastrarCliente, editarCliente, listarClientes, detalharCliente } = require("./controladores/clientes");
const { cadastrarPedido, listarPedidos } = require("./controladores/pedidos");
const multer = require('./servicos/multer');

const rotas = express();

rotas.post("/usuario", validarCorpoRequisicao.validarCorpoRequisicao(schemaUsuario), cadastrarUsuario);
rotas.get("/categoria", listarCategorias);
rotas.post("/login", validarCorpoRequisicao.validarCorpoRequisicao(schemaLogin), login);

rotas.use(verificarUsuarioLogado);

rotas.get("/usuario", detalharUsuario);
rotas.put("/usuario", validarCorpoRequisicao.validarCorpoRequisicao(schemaUsuario), editarPerfilUsuarioLogado);

rotas.post("/produto", validarCorpoRequisicao.validarCorpoRequisicaoComImagem(schemaProduto), multer.single('produto_imagem'), cadastrarProduto);
rotas.put("/produto/:id", validarCorpoRequisicao.validarCorpoRequisicaoComImagem(schemaProduto), multer.single('produto_imagem'), editarProduto);
rotas.get("/produto", listarProdutos);
rotas.get("/produto/:id", detalharProduto);
rotas.delete("/produto/:id", excluirProduto);
rotas.post("/cliente", validarCorpoRequisicao.validarCorpoRequisicao(schemaCliente), cadastrarCliente);
rotas.put("/cliente/:id", validarCorpoRequisicao.validarCorpoRequisicao(schemaCliente), editarCliente);
rotas.get("/cliente", listarClientes);
rotas.get("/cliente/:id", detalharCliente);
rotas.post("/pedido", cadastrarPedido);
rotas.get("/pedido", listarPedidos);

module.exports = rotas;
