@echo off

for %%I in (.) do set CurrDirName=%~dp0

echo Criando diretorios...

cd \

set BaseDir=%USERPROFILE%\desktop\gerador-descricao

if exist %BaseDir% (
    rmdir /S /Q %BaseDir%
)

mkdir %BaseDir%
mkdir %BaseDir%\skus
mkdir %BaseDir%\codigo-gerado
mkdir %BaseDir%\exemplo-formato-arquivo
mkdir %BaseDir%\utils
mkdir %BaseDir%\types
mkdir %BaseDir%\interfaces

echo Baixando arquivos necessarios...

cd %BaseDir% && curl --ssl-no-revoke -m 600 -O {URL} && curl --ssl-no-revoke -m 600 -O {URL} && curl --ssl-no-revoke -m 600 -O {URL} && curl --ssl-no-revoke -m 600 -O {URL} && curl --ssl-no-revoke -m 600 -O {URL}

attrib +h +r +a /s /d %BaseDir%\index.js
attrib +h +r +a /s /d %BaseDir%\index.d.ts
attrib +h +r +a /s /d %BaseDir%\description.js
attrib +h +r +a /s /d %BaseDir%\description.d.ts

cd utils && curl --ssl-no-revoke -m 600 -O {URL} && curl --ssl-no-revoke -m 600 -O {URL} && curl --ssl-no-revoke -m 600 -O {URL} && curl --ssl-no-revoke -m 600 -O {URL} && curl --ssl-no-revoke -m 600 -O {URL} && curl --ssl-no-revoke -m 600 -O {URL} && cd ..

attrib +h +r +a /s /d %BaseDir%\utils

cd types && curl --ssl-no-revoke -m 600 -O {URL} && curl --ssl-no-revoke -m 600 -O {URL} && curl --ssl-no-revoke -m 600 -O {URL} && curl --ssl-no-revoke -m 600 -O {URL} && cd ..

attrib +h +r +a /s /d  %BaseDir%\types

cd interfaces && curl --ssl-no-revoke -m 600 -O {URL} && curl -m 600 -O {URL} && cd ..

attrib +h +r +a /s /d %BaseDir%\interfaces

cd exemplo-formato-arquivo && curl -m 600 -O {URL} && cd ..

echo Verificando a instalacao do Node.js

for %%X in (node.exe) do (set HAS_NODE=%%~$PATH:X)

if not defined HAS_NODE (
    echo Baixando o Node.js. Por favor, aguarde...

    curl --ssl-no-revoke -m 600 -O https://nodejs.org/dist/v16.14.0/node-v16.14.0-x64.msi

    echo Iniciando a instalacao...

    start %BaseDir%\node-v16.14.0-x64.msi
) else (
    echo Inicializacao da pasta concluida com sucesso!.
)

if exist node-v16.14.0-x64.msi  (
    for %%X in (node.exe) do (set HAS_INSTALL=%%~$PATH:X)

    if defined HAS_INSTALL (
        del node-v16.14.0-x64.msi
    ) else (
        echo Tente instalar novamente o Node.js presente na pasta gerador-descricao
    )
)

pause