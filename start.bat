@echo off
echo ========================================
echo    PORTAL DO ALUNO - BACKEND
echo ========================================
echo.
echo Iniciando servidor de desenvolvimento...
echo.
echo IMPORTANTE: Configure o arquivo .env antes!
echo Copie config.env.example para .env e edite
echo com suas credenciais do MongoDB.
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

echo.
echo Iniciando servidor...
npm run dev
