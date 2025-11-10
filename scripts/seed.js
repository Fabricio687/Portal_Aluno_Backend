const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function seedDatabase() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    
    const { DB_USER, DB_PASS, DB_NAME, MONGODB_URI } = process.env;
    const atlas = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.i1ywpkx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
    const uri = MONGODB_URI || atlas;
    
    await mongoose.connect(uri);
    console.log('✅ Conectado ao MongoDB');

    // Limpar usuários existentes
    await User.deleteMany({});
    console.log('🧹 Usuários existentes removidos');

    // Criar usuários de exemplo
    const users = [
      {
        name: 'João Silva',
        email: 'joao@teste.com',
        password: '123456',
        role: 'customer'
      },
      {
        name: 'Maria Admin',
        email: 'admin@teste.com',
        password: '123456',
        role: 'admin'
      },
      {
        name: 'Pedro Staff',
        email: 'staff@teste.com',
        password: '123456',
        role: 'staff'
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Usuário criado: ${user.email}`);
    }

    console.log('🎉 Banco de dados populado com sucesso!');
    console.log('\n📋 Usuários criados:');
    console.log('- joao@teste.com (senha: 123456) - Cliente');
    console.log('- admin@teste.com (senha: 123456) - Admin');
    console.log('- staff@teste.com (senha: 123456) - Staff');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
}

seedDatabase();
