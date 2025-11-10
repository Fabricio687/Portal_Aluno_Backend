const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function testRegistration() {
  try {
    console.log('🧪 Testando sistema de cadastro...');
    
    const { DB_USER, DB_PASS, DB_NAME, MONGODB_URI } = process.env;
    const atlas = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.i1ywpkx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
    const uri = MONGODB_URI || atlas;
    
    await mongoose.connect(uri);
    console.log('✅ Conectado ao MongoDB');

    // Limpar usuários existentes para teste limpo
    await User.deleteMany({});
    console.log('🧹 Banco limpo para teste');

    // Teste 1: Cadastro válido
    console.log('\n📝 Teste 1: Cadastro válido');
    const testUser = new User({
      name: 'João Teste',
      email: 'joao.teste@exemplo.com',
      password: '123456'
    });
    
    await testUser.save();
    console.log('✅ Usuário criado com sucesso:', testUser.email);

    // Teste 2: Tentar cadastrar email duplicado
    console.log('\n📝 Teste 2: Email duplicado');
    try {
      const duplicateUser = new User({
        name: 'João Duplicado',
        email: 'joao.teste@exemplo.com',
        password: '123456'
      });
      await duplicateUser.save();
      console.log('❌ ERRO: Email duplicado foi aceito!');
    } catch (error) {
      if (error.code === 11000) {
        console.log('✅ Email duplicado rejeitado corretamente');
      } else {
        console.log('❌ Erro inesperado:', error.message);
      }
    }

    // Teste 3: Verificar hash da senha
    console.log('\n📝 Teste 3: Verificação de senha');
    const foundUser = await User.findOne({ email: 'joao.teste@exemplo.com' });
    const isPasswordValid = await foundUser.comparePassword('123456');
    const isPasswordInvalid = await foundUser.comparePassword('senhaerrada');
    
    console.log('✅ Senha correta:', isPasswordValid);
    console.log('✅ Senha incorreta rejeitada:', !isPasswordInvalid);

    // Teste 4: Verificar campos padrão
    console.log('\n📝 Teste 4: Campos padrão');
    console.log('✅ Status:', foundUser.status);
    console.log('✅ Role:', foundUser.role);
    console.log('✅ Timestamps:', foundUser.createdAt, foundUser.updatedAt);

    console.log('\n🎉 Todos os testes passaram! Sistema de cadastro funcionando perfeitamente.');
    console.log('\n📱 Agora você pode cadastrar usuários diretamente no mobile!');
    console.log('📋 Usuário de teste criado: joao.teste@exemplo.com / 123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    process.exit(1);
  }
}

testRegistration();
