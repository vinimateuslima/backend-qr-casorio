const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const allowlist = [
  process.env.FRONTEND_URL || 'http://localhost:3001',
  'http://localhost:3000',
  'http://localhost:3001'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite chamadas server-to-server (sem origin) e as origens da allowlist
    if (!origin || allowlist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static("public")); // Serve arquivos estáticos (como imagens, etc.)

require("./db/conn");

const convidadosRoutes = require("./routes");

app.use("/convidados", convidadosRoutes);

const port = process.env.PORT || 3000;

// Para a Vercel, precisamos exportar o app
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}
