@echo off

for %%I in (.) do set CurrDirName=%~dp0

echo "liberando e iniciando a pasta para à geração dos arquivos"

attrib -s -h -a /s /d  %CurrDirName%description-generator.cmd
attrib -s -h -a /s /d  %CurrDirName%exemplo-arquivo-json

echo "Criando pastas de entrada e saída do conteúdo"

mkdir skus
mkdir codigo-gerado

echo "Verificando a instalação do Node.js"

for %%X in (node.exe) do (set FOUND=%%~$PATH:X)

if not defined FOUND (
    echo Baixando o Node.js. Por favor, aguarde

    curl -O https://nodejs.org/dist/v16.14.0/node-v16.14.0-x64.msi --ssl-no-revoke

    echo Prossiga a instalação do - node sem fechar esta tela - e, após finalizar, volte para continuar a inicialização da pasta de geração de descrições.

    start %CurrDirName%node-v16.14.0-x64.msi

    pause

    echo Inicialização da pasta concluída com sucesso!.
) else (
    echo Inicialização da pasta concluída com sucesso!.
)

del %CurrDirName%init.cmd
del %CurrDirName%node-v16.14.0-x64.msi

pause