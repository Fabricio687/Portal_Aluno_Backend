require('dotenv').config({ path: '../config.env' });
const mongoose = require('mongoose');
const Course = require('../models/Course');

const itCourses = [
  {
    name: 'Desenvolvimento Full Stack',
    code: 'FS001',
    credits: 6,
    professor: 'Prof. Ricardo Almeida',
    schedule: 'Segunda e Quarta 19:00-22:00',
    room: 'Lab 201',
    description: 'Desenvolvimento de aplicações web completas com React, Node.js e MongoDB',
    semester: 3
  },
  {
    name: 'Ciência de Dados',
    code: 'CD001',
    credits: 5,
    professor: 'Profa. Mariana Santos',
    schedule: 'Terça e Quinta 14:00-16:30',
    room: 'Lab 202',
    description: 'Fundamentos de análise de dados, machine learning e visualização de dados',
    semester: 4
  },
  {
    name: 'Segurança da Informação',
    
    code: 'SI001',
    credits: 4,
    professor: 'Prof. Fernando Costa',
    schedule: 'Segunda e Quarta 08:00-10:00',
    room: 'Lab 203',
    description: 'Princípios de segurança, criptografia e proteção de sistemas',
    semester: 5
  },
  {
    name: 'DevOps e Cloud Computing',
    code: 'DO001',
    credits: 5,
    professor: 'Prof. Gustavo Mendes',
    schedule: 'Terça e Quinta 19:00-21:30',
    room: 'Lab 204',
    description: 'Integração contínua, entrega contínua e infraestrutura como código',
    semester: 5
  },
  {
    name: 'Desenvolvimento Mobile',
    code: 'DM001',
    credits: 5,
    professor: 'Profa. Carla Oliveira',
    schedule: 'Quarta e Sexta 14:00-16:30',
    room: 'Lab 205',
    description: 'Desenvolvimento de aplicativos para iOS e Android com React Native',
    semester: 4
  },
  {
    name: 'Inteligência Artificial',
    code: 'IA001',
    credits: 6,
    professor: 'Prof. Lucas Ferreira',
    schedule: 'Segunda e Quarta 14:00-17:00',
    room: 'Lab 206',
    description: 'Fundamentos de IA, redes neurais e aprendizado profundo',
    semester: 6
  },
  {
    name: 'Arquitetura de Software',
    code: 'AS001',
    credits: 4,
    professor: 'Prof. Paulo Ribeiro',
    schedule: 'Terça e Quinta 08:00-10:00',
    room: 'Lab 207',
    description: 'Padrões de projeto, arquiteturas escaláveis e microserviços',
    semester: 5
  },
  {
    name: 'Blockchain e Criptomoedas',
    code: 'BC001',
    credits: 4,
    professor: 'Profa. Renata Lima',
    schedule: 'Quinta e Sexta 19:00-21:00',
    room: 'Lab 208',
    description: 'Fundamentos de blockchain, smart contracts e aplicações descentralizadas',
    semester: 6
  }
];

const seedITCourses = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.DATABASE_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexão com o banco de dados estabelecida com sucesso');

    // Limpar cursos existentes com os mesmos códigos
    const courseCodes = itCourses.map(course => course.code);
    await Course.deleteMany({ code: { $in: courseCodes } });
    console.log('Cursos existentes com os mesmos códigos foram removidos');

    // Inserir novos cursos
    const createdCourses = await Course.insertMany(itCourses);
    console.log(`${createdCourses.length} cursos de TI foram cadastrados com sucesso:`);
    createdCourses.forEach(course => {
      console.log(`- ${course.name} (${course.code})`);
    });

    console.log('Processo de seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao cadastrar cursos de TI:', error);
  } finally {
    // Fechar conexão com o banco de dados
    await mongoose.connection.close();
    console.log('Conexão com o banco de dados fechada');
    process.exit(0);
  }
};

// Executar o script
seedITCourses();