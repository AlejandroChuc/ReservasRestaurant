@echo off
echo.
echo ================================================
echo   DIAGNOSTICO COMPLETO DEL SISTEMA
echo ================================================
echo.

echo 1. Probando conexion a la base de datos...
echo ------------------------------------------------
node test-db.js
echo.

echo 2. Iniciando servidor de prueba...
echo ------------------------------------------------
echo (El servidor se iniciara en modo debug)
echo (Presiona Ctrl+C para detenerlo)
echo.
node server-test.js
