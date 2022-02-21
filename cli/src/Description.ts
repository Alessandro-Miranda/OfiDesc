import { existsSync, mkdirSync, readdir, readFile, writeFile } from 'fs';
import { basename } from 'path/posix';
import { IDescription } from './interfaces/IDescription';
import { DescriptionData } from './types/global';
import MenuOptions from './types/menu';
import generateHTML from './utils/generateHTML';
import minifyHTML from './utils/minifyHTML';

type FileArray = {
    extension: string;
    fileData: string;
    fileName: string;
}

class Description implements IDescription {
    private selectedOption: string;

    private allowedOptions = ['dirname', 'userProfile', 'entry'];

    private allowedExtension = ['json', 'doc', 'docx'];

    private args: string[][] = [];

    private files: FileArray[] = [];

    private filesToSave: FileArray[] = [];

    constructor(option: string) {
        this.selectedOption = option;
    }

    public getArgs() {
        this.args = process.argv
            .filter((arg) => /^--/.test(arg))
            .map((arg) => arg.replace(/^--/, '').split('='))
            .filter(([key]) => this.allowedOptions.includes(key));
    }

    public async init(): Promise<void> {
        try {
            await this.checkFileExtensions();
        } catch (err) {
            console.error(`${err}\n`);
            console.info('Finalizando o process\n');
            process.exit();
        }

        try {
            await this.readFiles();
        } catch (err) {
            console.error(`${err}\n`);
            console.info('Finalizando o processo\n');
            process.exit();
        }

        try {
            console.info('Gerando arquivos...\n');

            if (this.selectedOption === MenuOptions.HTML) {
                this.generateHTMLFile();
            }

            if (this.selectedOption === MenuOptions.CSV) {
                this.generateCSVFile();
            }

            if (this.selectedOption === MenuOptions.CSVHTML) {
                this.generateHTMLFile();
                this.generateCSVFile();
            }

            await this.saveFile();

            console.info('Descrições salvas nas pasta "descricoes"\n');
        } catch (err) {
            console.error(`${err}\n`);
            console.log('Finalizando o process\n');
            process.exit();
        }
    }

    public generateCSVFile() {
        console.info('Gerando arquivo CSV...\n');

        const lines = this.files.map(({ extension, fileData }) => {
            const json = Description.createJson(extension, fileData);

            return generateHTML(json);
        }).join('\n');

        this.filesToSave.push({
            extension: 'csv',
            fileData: minifyHTML(lines),
            fileName: `descriptions-${new Date().getTime()}`,
        });
    }

    public generateHTMLFile() {
        console.info('Gerando arquivo HTML...\n');

        this.files.forEach(({ extension, fileData, fileName }) => {
            const json = Description.createJson(extension, fileData);

            const HTML = generateHTML(json);

            this.filesToSave.push({
                extension: 'html',
                fileData: minifyHTML(HTML),
                fileName,
            });
        });
    }

    private static createJson(fileExtension: string, data: string) {
        let json = {} as DescriptionData;

        if (fileExtension === 'json') {
            json = JSON.parse(data) as DescriptionData;
        }

        return json;
    }

    private async readFiles(): Promise<void> {
        console.info('Lendo arquivos...\n');

        return new Promise((resolve, reject) => {
            const entry = this.getEntryFolder();

            readdir(entry, (err, files) => {
                if (err) {
                    reject(new Error('Erro ao tentar acessar a pasta com os arquivos. Por favor, tente novamente\n'));
                }

                files.forEach((file) => {
                    readFile(`${entry}\\${file}`, { encoding: 'utf-8' }, (error, data) => {
                        if (error) {
                            reject(new Error(`Erro lendo o arquivo: ${file}\n. ${error}`));
                        }

                        const extension = file.split('.')[1];

                        this.files.push({
                            extension,
                            fileData: data,
                            fileName: basename(file).replace(/\.\w+$/, ''),
                        });

                        resolve();
                    });
                });
            });
        });
    }

    private getEntryFolder() {
        let entry = '';

        this.args.forEach(([key, value]) => {
            if (key === 'entry') {
                entry = value;
            }
        });

        return entry;
    }

    private async checkFileExtensions(): Promise<void> {
        console.info('Checando a extensão dos arquivos...\n');

        const entry = this.getEntryFolder();

        return new Promise((resolve, reject) => {
            readdir(entry, (err, files) => {
                if (err) {
                    reject(new Error(`Erro lendo o diretório ${err}\n`));
                }

                files.forEach((file) => {
                    const extension = file.split('.')[1];

                    if (!this.allowedExtension.includes(extension)) {
                        reject(new Error(`Formato do arquivo ${file} não suportado. Por favor, utilize algumas das extensões permitidas: ${this.allowedExtension.join(', ')}\n`));
                    }
                });

                resolve();
            });
        });
    }

    public async saveFile(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.filesToSave.forEach(({ extension, fileData, fileName }) => {
                let dir = '';

                this.args.forEach(([key, value]) => {
                    if (key === 'dirname') {
                        dir = value.replace(/\\$/, '');
                    }
                });

                const subDir = extension === 'csv' ? 'csv' : 'html';
                const basedirToSaveFiles = `${dir}\\descricoes\\${subDir}`;

                if (!existsSync(basedirToSaveFiles)) {
                    mkdirSync(basedirToSaveFiles, { recursive: true });
                }

                writeFile(`${basedirToSaveFiles}\\${fileName}.${extension}`, fileData, { encoding: 'latin1' }, (err) => {
                    if (err) {
                        reject(new Error(`Erro salvando o arquivo ${fileName}`));
                    }
                });
            });

            resolve();
        });
    }
}

export default Description;
