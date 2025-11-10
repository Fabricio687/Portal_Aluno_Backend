const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  const { DB_USER, DB_PASS, DB_NAME, MONGODB_URI } = process.env;
  const atlas = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.i1ywpkx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
  const uri = MONGODB_URI || atlas;

  try {
    console.log('🔄 Tentando conectar ao MongoDB...');
    console.log('URI:', uri.replace(/\/\/.*@/, '//***:***@')); // Esconde credenciais no log
    
    await mongoose.connect(uri);
    console.log("✅ Conectado ao MongoDB com sucesso!");
    
    // Testar operação básica
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Coleções disponíveis:', collections.map(c => c.name));
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
}

testConnection();
