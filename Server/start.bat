@echo off
:Start
cls
node server
pause
cls

:Ask
echo Would you like to restart the server? (Y/N)
set INPUT=
set /P INPUT=Type input: %=%
If /I "%INPUT%"=="y" goto Start
If /I "%INPUT%"=="n" exit
echo Please type y or n & goto Ask

REM Yes I'm using a goto! Don't harass me!