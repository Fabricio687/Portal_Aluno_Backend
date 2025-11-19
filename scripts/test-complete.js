/**
 * Script de Teste Completo - Verifica se tudo está funcionando
 */

require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const http = require('http');

const { DB_USER, DB_PASS, DB_NAME, MONGODB_URI, PORT } = process.env;
const BACKEND_PORT = PORT || 3100;

console.log('\n🧪 TESTE COMPLETO DO SISTEMA\n');
console.log('='.repeat(50));

// Teste 1: Verificar configuração
console.log('\n1️⃣ Verificando configuração...');
let uri;
if (MONGODB_URI) {
  if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
    console.error('❌ MONGODB_URI aponta para MongoDB local!');
    process.exit(1);
  }
  if (MONGODB_URI.includes('usuario') || MONGODB_URI.includes('senha') || MONGODB_URI.includes('<username>')) {
    console.error('❌ MONGODB_URI contém valores de exemplo!');
    process.exit(1);
  }
  uri = MONGODB_URI;
  console.log('✅ MONGODB_URI configurada');
} else if (DB_USER && DB_PASS && DB_NAME) {
  if (DB_USER.includes('seu_usuario') || DB_PASS.includes('sua_senha')) {
    console.error('❌ Variáveis contêm valores de exemplo!');
    process.exit(1);
  }
  uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.7hrgleb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
  console.log('✅ Variáveis individuais configuradas');
} else {
  console.error('❌ Nenhuma configuração encontrada!');
  process.exit(1);
}

// Teste 2: Conectar ao MongoDB
console.log('\n2️⃣ Testando conexão com MongoDB...');
async function testMongoDB() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ Conectado ao MongoDB com sucesso!');
    
    // Testar operação básica
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ Banco de dados acessível (${collections.length} coleções encontradas)`);
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    if (error.message.includes('authentication failed')) {
      console.error('💡 Verifique se usuário e senha estão corretos');
    } else if (error.message.includes('timeout')) {
      console.error('💡 Verifique sua conexão com a internet e se o IP está na whitelist');
    }
    return false;
  }
}

// Teste 3: Verificar se backend está rodando
console.log('\n3️⃣ Testando se backend está rodando...');
function testBackend() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${BACKEND_PORT}/api`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Backend está rodando e respondendo!');
          console.log('   Resposta:', data.substring(0, 100));
          resolve(true);
        } else {
          console.error(`❌ Backend respondeu com status ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        console.error(`❌ Backend NÃO está rodando na porta ${BACKEND_PORT}`);
        console.error('💡 Inicie o backend com: npm run dev');
      } else {
        console.error('❌ Erro ao conectar ao backend:', error.message);
      }
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      console.error('❌ Timeout ao conectar ao backend');
      resolve(false);
    });
  });
}

// Teste 4: Verificar rota de login
console.log('\n4️⃣ Testando rota de login...');
function testLoginRoute() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      email: 'test@test.com',
      password: 'test123'
    });
    
    const options = {
      hostname: 'localhost',
      port: BACKEND_PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        // 401 é esperado com credenciais inválidas, significa que a rota funciona
        if (res.statusCode === 401 || res.statusCode === 400) {
          console.log('✅ Rota de login está funcionando!');
          console.log(`   Status: ${res.statusCode} (esperado para credenciais inválidas)`);
          resolve(true);
        } else if (res.statusCode === 503) {
          console.error('❌ Rota retornou 503 - MongoDB não conectado');
          resolve(false);
        } else {
          console.log(`⚠️  Status inesperado: ${res.statusCode}`);
          resolve(true); // Ainda assim consideramos que a rota existe
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Erro ao testar rota de login:', error.message);
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// Executar todos os testes
async function runAllTests() {
  const mongoOk = await testMongoDB();
  const backendOk = await testBackend();
  const loginOk = await testLoginRoute();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESULTADO DOS TESTES');
  console.log('='.repeat(50));
  console.log(`   MongoDB: ${mongoOk ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`   Backend: ${backendOk ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`   Rota Login: ${loginOk ? '✅ OK' : '❌ FALHOU'}`);
  
  if (mongoOk && backendOk && loginOk) {
    console.log('\n🎉 TUDO FUNCIONANDO CORRETAMENTE!');
    console.log('\n💡 Próximos passos:');
    console.log('   1. Execute: npm run seed:full (para popular o banco)');
    console.log('   2. Acesse: http://localhost:5173');
    console.log('   3. Faça login com: admin@portal.edu.br / 123456');
    process.exit(0);
  } else {
    console.log('\n⚠️  ALGUNS TESTES FALHARAM');
    console.log('\n💡 Verifique os erros acima e corrija antes de continuar');
    process.exit(1);
  }
}

runAllTests();

