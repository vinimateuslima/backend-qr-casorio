const Convidado = require("../models/Convidados");
const crypto = require("crypto");

// Função para gerar senha alfanumérica de 8 caracteres
function gerarSenha() {
  return crypto.randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
}

// Cadastrar um novo convidado
const cadastrarConvidado = async (req, res) => {
  try {
    const senhaGerada = gerarSenha();
    const dados = {
      ...req.body,
      senha: senhaGerada
    };

    const novoConvidado = new Convidado(dados);
    await novoConvidado.save();

    res.status(201).json({
      mensagem: "Convidado cadastrado com sucesso",
      convidado: novoConvidado,
      senhaGerada // opcional: para retornar a senha criada
    });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

// Atualizar um convidado existente
const atualizarConvidado = async (req, res) => {
  try {
    const { id } = req.params;
    const convidadoAtualizado = await Convidado.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!convidadoAtualizado) {
      return res.status(404).json({ mensagem: "Convidado não encontrado" });
    }

    res.json(convidadoAtualizado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

// Excluir um convidado
const excluirConvidado = async (req, res) => {
  try {
    const { id } = req.params;
    const convidadoExcluido = await Convidado.findByIdAndDelete(id);

    if (!convidadoExcluido) {
      return res.status(404).json({ mensagem: "Convidado não encontrado" });
    }

    res.json({ mensagem: "Convidado excluído com sucesso" });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

const validarSenha = async (req, res) => {
  try {
    const { senha } = req.body;

    if (!senha) {
      return res.status(400).json({ mensagem: "Senha é obrigatória" });
    }

    const convidado = await Convidado.findOne({ senha });

    if (!convidado) {
      return res.status(404).json({ mensagem: "Senha inválida" });
    }

    if (convidado.status === true) {
      return res.status(403).json({ mensagem: "Essa senha já foi utilizada" });
    }

    // Atualiza status para true
    convidado.status = true;
    await convidado.save();

    res.json({
      mensagem: "Senha validada com sucesso",
      convidado
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Buscar todos os convidados
const listarConvidados = async (req, res) => {
  try {
    const convidados = await Convidado.find();
    res.json(convidados);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Buscar apenas um convidado pelo ID
const buscarConvidadoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const convidado = await Convidado.findById(id);

    if (!convidado) {
      return res.status(404).json({ mensagem: "Convidado não encontrado" });
    }

    res.json(convidado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};



module.exports = {
  cadastrarConvidado,
  atualizarConvidado,
  excluirConvidado,
  validarSenha,
  listarConvidados,
  buscarConvidadoPorId
};