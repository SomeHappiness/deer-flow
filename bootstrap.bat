@echo off
SETLOCAL ENABLEEXTENSIONS

REM Check if argument is dev mode
SET MODE=%1
IF "%MODE%"=="--dev" GOTO DEV
IF "%MODE%"=="-d" GOTO DEV
IF "%MODE%"=="dev" GOTO DEV
IF "%MODE%"=="development" GOTO DEV

:PROD
echo Starting BTF Brain in [PRODUCTION] mode...
uv run server.py
cd web
pnpm start
GOTO END

:DEV
echo Starting BTF Brain in [DEVELOPMENT] mode...
start uv run server.py --reload
cd web
start pnpm dev
REM Wait for user to close
pause

:END
ENDLOCAL
