@echo off
echo ========================================
echo    VERIFICACAO DO BACKEND
echo ========================================
echo.

echo Verificando arquivo .env...
if exist ".env" (
    echo [OK] Arquivo .env encontrado
) else (
    echo [ERRO] Arquivo .env NAO encontrado!
    echo Copiando config.env.example para .env...
    copy config.env.example .env
    echo.
    echo IMPORTANTE: Edite o arquivo .env com suas credenciais do MongoDB!
    echo.
    pause
    exit /b 1
)

echo.
echo Verificando se o servidor esta rodando na porta 3001...
netstat -ano | findstr :3001 >nul
if %errorlevel% == 0 (
    echo [OK] Algo esta rodando na porta 3001
) else (
    echo [AVISO] Nada encontrado na porta 3001
    echo O servidor pode nao estar rodando
)

echo.
echo Para iniciar o servidor, execute:
echo   npm run dev
echo   OU
echo   start-dev.bat
echo.
pause


