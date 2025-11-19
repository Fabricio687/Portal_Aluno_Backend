@echo off
echo ========================================
echo    PORTAL DO ALUNO - BACKEND
echo ========================================
echo.
echo Verificando configuracoes...
echo.

REM Verificar se config.env existe
if not exist "config.env" (
    echo [ERRO] Arquivo config.env nao encontrado!
    echo.
    echo Por favor, crie o arquivo config.env com suas configuracoes.
    echo Veja o arquivo config.env.example para referencia.
    echo.
    pause
    exit /b 1
)

echo [OK] Arquivo config.env encontrado
echo.

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo [AVISO] node_modules nao encontrado. Instalando dependencias...
    echo.
    call npm install
    echo.
)

echo ========================================
echo Iniciando servidor backend...
echo.
echo O servidor estara disponivel em:
echo http://localhost:3100/api
echo.
echo IMPORTANTE: Mantenha esta janela aberta!
echo Para parar o servidor, pressione Ctrl+C
echo ========================================
echo.

REM Iniciar o servidor
call npm run dev

pause
