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

// Buscar convidados com suporte a busca geral e filtros por campos
// Query params aceitos:
// - q: string de busca (aplica em nome, parentesco, senha)
// - campos: lista separada por vírgula para limitar a busca (ex: nome,parentesco,senha,status)
// - status: 'true' | 'false' para filtrar presença
const listarConvidados = async (req, res) => {
  try {
    const { q, campos, status } = req.query;

    const filtro = {};

    // Filtro por status (boolean)
    if (typeof status === 'string' && (status === 'true' || status === 'false')) {
      filtro.status = status === 'true';
    }

    // Busca textual nos campos
    if (typeof q === 'string' && q.trim().length > 0) {
      const valor = q.trim();
      const camposLista = typeof campos === 'string' && campos.trim().length > 0
        ? campos.split(',').map(c => c.trim()).filter(Boolean)
        : ['nome', 'parentesco', 'senha'];

      const regex = new RegExp(valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

      const orArray = [];
      if (camposLista.includes('nome')) orArray.push({ nome: { $regex: regex } });
      if (camposLista.includes('parentesco')) orArray.push({ parentesco: { $regex: regex } });
      if (camposLista.includes('senha')) orArray.push({ senha: { $regex: regex } });
      if (camposLista.includes('status')) {
        // Permitir que "q" também filtre status por palavras como presente/aguardando/true/false
        const qLower = valor.toLowerCase();
        if (['true', 'presente', '1'].includes(qLower)) {
          orArray.push({ status: true });
        } else if (['false', 'aguardando', '0', 'ausente'].includes(qLower)) {
          orArray.push({ status: false });
        }
      }

      if (orArray.length > 0) {
        filtro.$or = orArray;
      }
    }

    const convidados = await Convidado.find(filtro);
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