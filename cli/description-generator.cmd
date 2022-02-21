@echo off

@REM for %%I in (.) do set CurrDirName=%~dpnx0 // Obtém com o nome do arquivo

@REM Obtém o path de onde o arquivo está sendo executado
for %%I in (.) do set CurrDirName=%~dp0

set Script=%USERPROFILE%\description-generator\dist\index.js

node %Script% --dirname=%CurrDirName% --userProfile=%USERPROFILE% --entry=%CurrDirName%skus

pause