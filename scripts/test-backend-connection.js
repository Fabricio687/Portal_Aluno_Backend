require('dotenv').config({ path: './config.env' });
const http = require('http');

const PORT = process.env.PORT || 3100;
const HOST = 'localhost';

console.log('🔍 Testando conexão com o backend...\n');

// Testar se o servidor está rodando
const testConnection = () => {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://${HOST}:${PORT}/api`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Backend está rodando e respondendo!');
          console.log('📋 Resposta:', data);
          resolve(true);
        } else {
          console.log(`⚠️  Backend respondeu com status ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Backend NÃO está rodando na porta', PORT);
        console.log('\n💡 Solução:');
        console.log('   1. Certifique-se de que o backend está rodando');
        console.log(`   2. Execute: cd back-do-cafe-main && npm run dev`);
        console.log(`   3. Ou: npm start`);
        console.log(`   4. Verifique se a porta ${PORT} está livre`);
      } else {
        console.log('❌ Erro ao conectar:', error.message);
      }
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      console.log('❌ Timeout: Backend não respondeu em 5 segundos');
      reject(new Error('Timeout'));
    });
  });
};

// Testar rota de login
const testLoginRoute = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'test@test.com',
      password: 'test123'
    });
    
    const options = {
      hostname: HOST,
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('\n📝 Teste de rota /api/auth/login:');
        console.log(`   Status: ${res.statusCode}`);
        if (res.statusCode === 401) {
          console.log('   ✅ Rota está funcionando (erro 401 é esperado com credenciais inválidas)');
        } else {
          console.log('   Resposta:', data.substring(0, 200));
        }
        resolve(true);
      });
    });
    
    req.on('error', (error) => {
      console.log('\n❌ Erro ao testar rota de login:', error.message);
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
};

// Executar testes
async function runTests() {
  try {
    await testConnection();
    await testLoginRoute();
    console.log('\n✅ Testes concluídos!');
    process.exit(0);
  } catch (error) {
    console.log('\n❌ Testes falharam');
    process.exit(1);
  }
}

runTests();

