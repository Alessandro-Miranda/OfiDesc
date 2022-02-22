@echo off

@REM Obtém com o nome do arquivo
for %%I in (.) do set CurrDirName=%~dpnx0

@REM Obtém o path de onde o arquivo está sendo executado com barra no final
for %%I in (.) do set CurrDirName=%~dp0

@REM set Script=%USERPROFILE%\description-generator\dist\index.js

set Script=%CurrDirName%\index.js
set NODE_ENV=prod && node %Script% --dirname=%CurrDirName% --userProfile=%USERPROFILE% --entry=%CurrDirName%skus --output=codigo-gerado

pause