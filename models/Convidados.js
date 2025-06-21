const mongoose = require('mongoose');

const ConvidadoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  parentesco: {
    type: String,
    default: 'amigo'
  },
  senha: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Convidado', ConvidadoSchema);
