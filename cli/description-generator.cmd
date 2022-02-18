@echo off

for %%I in (.) do set CurrDirName=%~dpnx0
set Script=%USERPROFILE%\description-generator\dist\index.js

node %Script% --%CurrDirName% --%USERPROFILE%

pause