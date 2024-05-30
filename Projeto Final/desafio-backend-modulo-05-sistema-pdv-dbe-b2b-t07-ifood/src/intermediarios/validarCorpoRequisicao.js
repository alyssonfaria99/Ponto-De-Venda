const validarCorpoRequisicao = (joiSchema) => async (req, res, next) => {
	try {
		await joiSchema.validateAsync(req.body);
		next();
	} catch (error) {
		return res.status(400).json({ mensagem: error.message });
	};
};

const validarCorpoRequisicaoComImagem = (joiSchema) => async (req, res, next) => {
	try {
		await joiSchema.validateAsync(req.body.json);
		next();
	} catch (error) {
		return res.status(400).json({ mensagem: error.message });
	};
};

module.exports = {
	validarCorpoRequisicao,
	validarCorpoRequisicaoComImagem
}
