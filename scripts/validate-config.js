/**
 * Script para validar a configuração do MongoDB
 */

require('dotenv').config({ path: './config.env' });
const { DB_USER, DB_PASS, DB_NAME, MONGODB_URI } = process.env;

console.log('\n🔍 Validando configuração do MongoDB...\n');

let hasErrors = false;

// Verificar MONGODB_URI
if (MONGODB_URI) {
  if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
    console.error('❌ MONGODB_URI aponta para MongoDB local!');
    console.error('   Use MongoDB Atlas (cloud)');
    hasErrors = true;
  } else if (MONGODB_URI.includes('usuario') || MONGODB_URI.includes('senha') || MONGODB_URI.includes('<username>') || MONGODB_URI.includes('<password>')) {
    console.error('❌ MONGODB_URI contém valores de exemplo!');
    console.error('   Substitua <username> e <password> pelos valores reais');
    hasErrors = true;
  } else {
    console.log('✅ MONGODB_URI configurada');
    console.log('   URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  }
} else {
  console.log('⚠️  MONGODB_URI não definida');
  
  // Verificar variáveis individuais
  if (DB_USER) {
    if (DB_USER.includes('seu_usuario') || DB_USER.includes('usuario')) {
      console.error('❌ DB_USER contém valor de exemplo!');
      console.error('   Valor atual:', DB_USER);
      console.error('   Configure com seu usuário REAL do MongoDB Atlas');
      hasErrors = true;
    } else {
      console.log('✅ DB_USER configurado');
    }
  } else {
    console.error('❌ DB_USER não definida');
    hasErrors = true;
  }
  
  if (DB_PASS) {
    if (DB_PASS.includes('sua_senha') || DB_PASS.includes('senha')) {
      console.error('❌ DB_PASS contém valor de exemplo!');
      console.error('   Configure com sua senha REAL do MongoDB Atlas');
      hasErrors = true;
    } else {
      console.log('✅ DB_PASS configurado');
    }
  } else {
    console.error('❌ DB_PASS não definida');
    hasErrors = true;
  }
  
  if (DB_NAME) {
    console.log('✅ DB_NAME configurado:', DB_NAME);
  } else {
    console.error('❌ DB_NAME não definida');
    hasErrors = true;
  }
}

// Verificar JWT_SECRET
if (process.env.JWT_SECRET) {
  if (process.env.JWT_SECRET.length < 16) {
    console.error('⚠️  JWT_SECRET muito curto (mínimo 16 caracteres)');
  } else {
    console.log('✅ JWT_SECRET configurado');
  }
} else {
  console.error('❌ JWT_SECRET não definida');
  hasErrors = true;
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.error('\n❌ CONFIGURAÇÃO INCOMPLETA!');
  console.error('\n💡 PRÓXIMOS PASSOS:');
  console.error('   1. Acesse: https://www.mongodb.com/cloud/atlas');
  console.error('   2. Crie uma conta e cluster gratuito');
  console.error('   3. Crie um usuário com senha');
  console.error('   4. Adicione IP 0.0.0.0/0 na Network Access');
  console.error('   5. Copie a URI de conexão');
  console.error('   6. Edite config.env e configure MONGODB_URI com a URI real');
  console.error('\n📚 Veja GUIA_RAPIDO_CONFIGURACAO.md para instruções detalhadas\n');
  process.exit(1);
} else {
  console.log('\n✅ CONFIGURAÇÃO VÁLIDA!');
  console.log('\n💡 Você pode iniciar o backend com: npm run dev\n');
  process.exit(0);
}

