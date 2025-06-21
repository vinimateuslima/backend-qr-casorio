const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
