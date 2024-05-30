CREATE DATABASE pdv;

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL
);

INSERT INTO categorias (descricao)
VALUES 
  ('Informática'),
  ('Celulares'),
  ('Beleza e Perfumaria'),
  ('Mercado'),
  ('Livros e Papelaria'),
  ('Brinquedos'),
  ('Moda'),
  ('Bebê'),
  ('Games');

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    quantidade_estoque INTEGER NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    categoria_id INTEGER REFERENCES categorias(id) NOT NULL
);


CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    cep VARCHAR(8),
    rua VARCHAR(255),
    numero VARCHAR(10),
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(2)
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) NOT NULL,
    observacao VARCHAR(255),
    valor_total NUMERIC(10, 2)
);

CREATE TABLE pedido_produtos (
    pedido_id INTEGER REFERENCES pedidos(id) NOT NULL,
    produto_id INTEGER REFERENCES produtos(id) NOT NULL,
    quantidade_produto INTEGER NOT NULL,
    valor_produto NUMERIC(10, 2) NOT NULL
);

ALTER TABLE produtos
ADD COLUMN produto_imagem VARCHAR(255);

