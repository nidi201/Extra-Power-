@echo off
cd /d c:\Users\nidalhashmii\Downloads\cleanpro\cleanpro\client
echo Installing dependencies...
call npm install
echo Deploying to Vercel...
call npx vercel --prod
pause
