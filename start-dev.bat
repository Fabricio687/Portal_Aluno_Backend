@echo off
echo ========================================
echo    PORTAL DO ALUNO - BACKEND
echo ========================================
echo.
echo Verificando configuracoes...
echo.

REM Verificar se está na pasta correta
if not exist "index.js" (
    echo ERRO: Nao estou na pasta correta do backend!
    echo Certifique-se de estar em: aircnc-backend - Copia
    pause
    exit /b 1
)

REM Verificar se o arquivo .env existe
if not exist ".env" (
    echo AVISO: Arquivo .env nao encontrado!
    echo Copiando config.env.example para .env...
    copy config.env.example .env
    echo.
    echo IMPORTANTE: Edite o arquivo .env com suas credenciais do MongoDB!
    echo.
    pause
)

echo Iniciando servidor de desenvolvimento...
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

echo.
echo Iniciando servidor...
npm run dev
