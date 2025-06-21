const express = require("express");
const router = express.Router();




const ConvidadoController = require("./controllers/ConvidadoController");




// Cadastrar convidado
router.post("/", ConvidadoController.cadastrarConvidado);

// Atualizar convidado pelo ID
router.put("/:id", ConvidadoController.atualizarConvidado);

// Excluir convidado pelo ID
router.delete("/:id", ConvidadoController.excluirConvidado);

// Validar senha do convidado
router.post("/validar", ConvidadoController.validarSenha);

// Buscar todos os convidados
router.get("/", ConvidadoController.listarConvidados);

// Buscar convidado por ID
router.get("/:id", ConvidadoController.buscarConvidadoPorId);


module.exports = router;
