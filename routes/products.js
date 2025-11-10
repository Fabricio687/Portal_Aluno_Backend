const express = require('express');
const router = express.Router();

// Dados de produtos (em produção viria do banco de dados)
const PRODUCTS = [
  {
    id: "1",
    title: "Cappuccino",
    price: 3.50,
    description: "Nosso espresso especial encontra xarope de chocolate branco e leite vaporizado, finalizado com calda de caramelo. Uma delícia doce e cremosa.",
    cover: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    ingredients: ["Espresso", "Leite", "Xarope de Chocolate Branco", "Calda de Caramelo"],
    category: "Bebidas"
  },
  {
    id: "2",
    title: "Latte",
    price: 4.00,
    description: "Espresso suave com leite vaporizado e uma camada delicada de espuma. Equilíbrio perfeito entre café e creme.",
    cover: "https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail: "https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    ingredients: ["Espresso", "Leite Vaporizado", "Espuma"],
    category: "Bebidas"
  },
  {
    id: "3",
    title: "Americano",
    price: 2.50,
    description: "Espresso forte diluído com água quente para uma experiência de café limpa e forte. Perfeito para quem ama o sabor puro do café.",
    cover: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    ingredients: ["Espresso", "Água Quente"],
    category: "Bebidas"
  },
  {
    id: "4",
    title: "Mocha",
    price: 4.50,
    description: "Chocolate rico encontra espresso com leite vaporizado, coberto com chantilly. Uma guloseima decadente para amantes de chocolate.",
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    ingredients: ["Espresso", "Xarope de Chocolate", "Leite Vaporizado", "Chantilly"],
    category: "Bebidas"
  },
  {
    id: "5",
    title: "Croissant de Chocolate",
    price: 5.50,
    description: "Croissant amanteigado e folhado recheado com chocolate rico. Combinação perfeita com qualquer café.",
    cover: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    ingredients: ["Croissant Amanteigado", "Chocolate Amargo"],
    category: "Doces"
  },
  {
    id: "6",
    title: "Muffin de Mirtilo",
    price: 4.50,
    description: "Muffin fresco assado repleto de mirtilos suculentos. Úmido e delicioso.",
    cover: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    ingredients: ["Farinha", "Mirtilos", "Açúcar", "Manteiga"],
    category: "Doces"
  },
  {
    id: "7",
    title: "Torrada de Abacate",
    price: 8.50,
    description: "Pão de fermentação natural fresco coberto com abacate amassado, tomates cereja e uma pitada de sal marinho.",
    cover: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    ingredients: ["Pão de Fermentação Natural", "Abacate", "Tomates Cereja", "Sal Marinho"],
    category: "Salgados"
  }
];

const CATEGORIES = ["Bebidas", "Doces", "Salgados"];

// @desc    Obter todos os produtos
// @route   GET /api/products
// @access  Public
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: PRODUCTS
  });
});

// @desc    Obter produto por ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produto não encontrado'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// @desc    Obter categorias
// @route   GET /api/products/categories
// @access  Public
router.get('/categories', (req, res) => {
  res.json({
    success: true,
    data: CATEGORIES
  });
});

// @desc    Obter produtos por categoria
// @route   GET /api/products/category/:category
// @access  Public
router.get('/category/:category', (req, res) => {
  const products = PRODUCTS.filter(p => p.category === req.params.category);
  
  res.json({
    success: true,
    data: products
  });
});

module.exports = router;
