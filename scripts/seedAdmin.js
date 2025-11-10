require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function main() {
  const { DB_USER, DB_PASS, DB_NAME } = process.env;
  const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.7hrgleb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    await mongoose.connect(uri);
    console.log('✅ Conectado ao MongoDB');

    const email = 'admin@local.com';
    const registration = 'ADM002';

    let user = await User.findOne({ email });
    if (user) {
      console.log('ℹ️ Usuário admin já existe:', email);
    } else {
      user = new User({
        name: 'Admin',
        email,
        password: '123456',
        registration,
        role: 'admin',
        course: 'Sistemas',
        semester: 1,
      });
      await user.save();
      console.log('✅ Usuário admin criado com sucesso:', email);
    }
  } catch (err) {
    console.error('❌ Erro ao criar usuário admin:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();