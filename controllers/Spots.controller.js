const User = require("../models/User");
const Spots = require("../models/Spots");

const store = async (req, res) => {
  const { company, price, techs } = req.body;
  const { user_id } = req.headers;

  // Validações básicas
  if (!user_id) {
    return res.status(400).json({ error: "user_id é obrigatório no header" });
  }

  if (!company || !price || !techs) {
    return res
      .status(400)
      .json({ error: "company, price e techs são obrigatórios" });
  }

  if (!req.file) {
    // CORRIGIDO: verifica se NÃO existe arquivo
    return res.status(400).json({ error: "Arquivo não enviado!!!" });
  }

  // O nome do arquivo (filename) vem de req.file, que é adicionado pelo multer
  const { filename } = req.file; // <-- Adicionado: extrai o nome do arquivo

  console.log(filename);

  const usuario = await User.findById(user_id);
  if (!usuario) {
    // Melhorado: adicionado chaves para o bloco if
    return res.status(400).json({ error: "Usuário não existe!!!" });
  }

  const spot = await Spots.create({
    user: user_id,
    thumbnail: filename, // <-- Adicionado: salva o nome do arquivo no banco de dados
    company,
    price,
    techs: techs.split(",").map((tech) => tech.trim()),
  });

  return res.json(spot);
};
const index = async (req, res) => {
  const { tech } = req.query;

  console.log(tech);

  const spots = await Spots.find({ techs: tech });

  return res.json(spots);
};

module.exports = { store, index };
