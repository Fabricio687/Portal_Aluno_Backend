// scripts/insertCourses.js
require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');

// Conectar ao MongoDB
const { DB_USER, DB_PASS, DB_NAME } = process.env;
const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.7hrgleb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri)
  .then(() => console.log('MongoDB conectado com sucesso'))
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

// Dados dos cursos para inserir
const courses = [
  {
    name: 'Introdução à Programação',
    code: 'IP001',
    credits: 4,
    professor: 'Prof. Carlos Silva',
    schedule: 'Segunda e Quarta 08:00-10:00',
    room: 'Lab 101',
    description: 'Fundamentos de programação e lógica de programação',
    semester: 1
  },
  {
    name: 'Algoritmos e Estruturas de Dados',
    code: 'AED001',
    credits: 5,
    professor: 'Prof. Ana Paula Costa',
    schedule: 'Terça e Quinta 14:00-16:30',
    room: 'Lab 102',
    description: 'Estruturas de dados básicas e algoritmos de ordenação e busca',
    semester: 2
  },
  {
    name: 'Banco de Dados',
    code: 'BD001',
    credits: 4,
    professor: 'Prof. Roberto Santos',
    schedule: 'Segunda e Quarta 14:00-16:00',
    room: 'Lab 103',
    description: 'Modelagem e implementação de bancos de dados relacionais',
    semester: 2
  },
  {
    name: 'Desenvolvimento Web',
    code: 'DW001',
    credits: 5,
    professor: 'Prof. Juliana Oliveira',
    schedule: 'Terça e Quinta 19:00-21:30',
    room: 'Lab 104',
    description: 'Desenvolvimento de aplicações web com HTML, CSS, JavaScript e frameworks',
    semester: 3
  },
  {
    name: 'Programação Orientada a Objetos',
    code: 'POO001',
    credits: 5,
    professor: 'Prof. Marcos Fernandes',
    schedule: 'Segunda e Quarta 19:00-21:30',
    room: 'Lab 105',
    description: 'Conceitos de POO, classes, herança, polimorfismo e encapsulamento',
    semester: 3
  },
  {
    name: 'Engenharia de Software',
    code: 'ES001',
    credits: 4,
    professor: 'Prof. Patricia Lima',
    schedule: 'Terça e Quinta 08:00-10:00',
    room: 'Sala 201',
    description: 'Metodologias de desenvolvimento de software e gestão de projetos',
    semester: 4
  },
  {
    name: 'Redes de Computadores',
    code: 'RC001',
    credits: 4,
    professor: 'Prof. Fernando Alves',
    schedule: 'Segunda e Quarta 10:00-12:00',
    room: 'Lab 106',
    description: 'Fundamentos de redes, protocolos TCP/IP e arquiteturas de rede',
    semester: 4
  },
  {
    name: 'Sistemas Operacionais',
    code: 'SO001',
    credits: 4,
    professor: 'Prof. Ricardo Pereira',
    schedule: 'Terça e Quinta 14:00-16:00',
    room: 'Lab 107',
    description: 'Funcionamento de sistemas operacionais, processos, threads e gerenciamento de memória',
    semester: 5
  },
  {
    name: 'Inteligência Artificial',
    code: 'IA001',
    credits: 5,
    professor: 'Prof. Luciana Ribeiro',
    schedule: 'Segunda e Quarta 14:00-16:30',
    room: 'Lab 108',
    description: 'Introdução à IA, machine learning e algoritmos de busca',
    semester: 6
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
  }
];

// Função para inserir os cursos
const insertCourses = async () => {
  try {
    // Limpar coleção existente
    await Course.deleteMany({});
    console.log('Coleção de cursos limpa com sucesso');

    // Inserir novos cursos
    const result = await Course.insertMany(courses);
    console.log(`${result.length} cursos inseridos com sucesso`);
    
    // Exibir os cursos inseridos
    console.log('Cursos inseridos:');
    result.forEach(course => {
      console.log(`- ${course.code}: ${course.name}`);
    });
    
    // Desconectar do MongoDB
    mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  } catch (error) {
    console.error('Erro ao inserir cursos:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Executar a função
insertCourses();