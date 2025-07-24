@echo off
echo.
echo ===============================================
echo  SISTEMA DE RESERVAS DE RESTAURANTE
echo ===============================================
echo.
echo Verificando dependencias...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado o no está en el PATH
    echo 💡 Instale Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si el directorio backend existe
if not exist "backend" (
    echo ❌ Directorio 'backend' no encontrado
    echo 💡 Asegúrese de estar en el directorio correcto del proyecto
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.

echo Ejecutando diagnóstico del sistema...
node diagnostico.js
echo.

echo ===============================================
echo Iniciando servidor backend en puerto 4000...
echo ===============================================
echo.
echo 💡 Para detener el servidor, presione Ctrl+C
echo 💡 El servidor estará disponible en: http://localhost:4000
echo.

cd backend
node server.js
