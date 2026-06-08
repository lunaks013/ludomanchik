@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  Анализ гемблинга — запуск сайта
echo  ================================
echo.

if not exist "node_modules\" (
    echo  Устанавливаю зависимости...
    call npm install
    if errorlevel 1 (
        echo  Ошибка npm install
        pause
        exit /b 1
    )
)

echo  Запускаю сервер. Не закрывайте это окно.
echo  Откройте в браузере адрес ниже.
echo.
call npm run dev
pause
