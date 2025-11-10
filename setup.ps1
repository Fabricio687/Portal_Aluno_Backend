# Sistema de Cafeteria - Setup Automático (Windows)
Write-Host "🍵 Sistema de Cafeteria - Setup Automático" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se npm está instalado
try {
    $npmVersion = npm --version
    Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm não encontrado. Instale npm primeiro." -ForegroundColor Red
    exit 1
}

# Setup do Backend
Write-Host ""
Write-Host "🔧 Configurando Backend..." -ForegroundColor Yellow
Set-Location "back-do-cafe-main"

if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Blue
    npm install
} else {
    Write-Host "✅ Dependências do backend já instaladas" -ForegroundColor Green
}

# Verificar se arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Yellow
    Write-Host "📝 Copiando config.env para .env..." -ForegroundColor Blue
    Copy-Item "config.env" ".env"
    Write-Host "🔧 Configure as variáveis no arquivo .env antes de continuar" -ForegroundColor Yellow
    Write-Host "   Especialmente: DB_USER, DB_PASS, DB_NAME" -ForegroundColor Yellow
} else {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
}

# Setup do Frontend
Write-Host ""
Write-Host "🔧 Configurando Frontend..." -ForegroundColor Yellow
Set-Location "../caf-front-main"

if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Blue
    npm install
} else {
    Write-Host "✅ Dependências do frontend já instaladas" -ForegroundColor Green
}

# Verificar se arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Yellow
    Write-Host "📝 Copiando config.env para .env..." -ForegroundColor Blue
    Copy-Item "config.env" ".env"
    Write-Host "✅ Arquivo .env criado" -ForegroundColor Green
} else {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure as variáveis no arquivo .env do backend" -ForegroundColor White
Write-Host "2. Execute: cd back-do-cafe-main && npm run dev" -ForegroundColor White
Write-Host "3. Em outro terminal: cd caf-front-main && npm start" -ForegroundColor White
Write-Host ""
Write-Host "📖 Para mais informações, consulte o README.md" -ForegroundColor Cyan
