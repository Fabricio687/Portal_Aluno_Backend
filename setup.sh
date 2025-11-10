#!/bin/bash

echo "🍵 Sistema de Cafeteria - Setup Automático"
echo "=========================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js primeiro."
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale npm primeiro."
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"

# Setup do Backend
echo ""
echo "🔧 Configurando Backend..."
cd back-do-cafe-main

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    npm install
else
    echo "✅ Dependências do backend já instaladas"
fi

# Verificar se arquivo .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Copiando config.env para .env..."
    cp config.env .env
    echo "🔧 Configure as variáveis no arquivo .env antes de continuar"
    echo "   Especialmente: DB_USER, DB_PASS, DB_NAME"
else
    echo "✅ Arquivo .env encontrado"
fi

# Setup do Frontend
echo ""
echo "🔧 Configurando Frontend..."
cd ../caf-front-main

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
else
    echo "✅ Dependências do frontend já instaladas"
fi

# Verificar se arquivo .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Copiando config.env para .env..."
    cp config.env .env
    echo "✅ Arquivo .env criado"
else
    echo "✅ Arquivo .env encontrado"
fi

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis no arquivo .env do backend"
echo "2. Execute: cd back-do-cafe-main && npm run dev"
echo "3. Em outro terminal: cd caf-front-main && npm start"
echo ""
echo "📖 Para mais informações, consulte o README.md"
