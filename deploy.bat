@echo off
echo 🚀 Iniciando proceso de construcción y despliegue...

REM Verificar que Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 18 o superior.
    pause
    exit /b 1
)

echo ✅ Node.js detectado
node -v

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

REM Construir el proyecto
echo 🔨 Construyendo el proyecto...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error en la construcción
    pause
    exit /b 1
)

echo ✅ Construcción completada exitosamente

echo 🎉 ¡Proyecto listo para despliegue en Vercel!
echo.
echo Para desplegar en Vercel:
echo 1. Instala Vercel CLI: npm i -g vercel
echo 2. Ejecuta: vercel --prod
echo.
echo Variables de entorno requeridas en Vercel:
echo - ABACUSAI_API_KEY
echo.
pause
