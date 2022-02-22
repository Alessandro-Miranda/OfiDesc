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

    private allowedOptions = ['dirname', 'userProfile', 'entry', 'output'];

    private allowedExtension = ['json', 'doc', 'docx'];

    private args: string[][] = [];

    private files: FileArray[] = [];

    private filesToSave: FileArray[] = [];

    constructor(option: string) {
        this.selectedOption = option;
    }

    public getArgs(): void {
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

            let output;

            this.args.forEach(([key, value]) => {
                if (key === 'output') {
                    output = value;
                }
            });

            console.info(`Descrições salvas nas pasta ${output}\n`);
        } catch (err) {
            console.error(`${err}\n`);
            console.log('Finalizando o process\n');
            process.exit();
        }
    }

    public generateCSVFile(): void {
        console.info('Gerando arquivo CSV...\n');

        const lines = this.files.map(({ extension, fileData, fileName }) => {
            const json = Description.createJson(extension, fileData);

            return `${fileName},${minifyHTML(generateHTML(json))}`;
        }).join('\n');

        this.filesToSave.push({
            extension: 'csv',
            fileData: `sku,Descrição Longa\n${lines}`,
            fileName: `descriptions-${new Date().getTime()}`,
        });
    }

    public generateHTMLFile(): void {
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

    private static createJson(fileExtension: string, data: string): DescriptionData {
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

                files.forEach((file, index) => {
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

                        if (index === files.length - 1) {
                            resolve();
                        }
                    });
                });
            });
        });
    }

    private getEntryFolder(): string {
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

    private async saveFile(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.filesToSave.forEach(({ extension, fileData, fileName }, index) => {
                let dir = '';
                let outputDir = '';

                this.args.forEach(([key, value]) => {
                    if (key === 'dirname') {
                        dir = value.replace(/\\$/, '');
                    }

                    if (key === 'output') {
                        outputDir = value;
                    }
                });

                const subDir = extension === 'csv' ? 'csv' : 'html';
                const basedirToSaveFiles = `${dir}\\${outputDir}\\${subDir}`;

                if (!existsSync(basedirToSaveFiles)) {
                    mkdirSync(basedirToSaveFiles, { recursive: true });
                }

                writeFile(`${basedirToSaveFiles}\\${fileName}.${extension}`, fileData, { encoding: extension === 'csv' ? 'latin1' : 'utf-8' }, (err) => {
                    if (err) {
                        reject(new Error(`Erro salvando o arquivo ${fileName}`));
                    }

                    if (index === this.filesToSave.length - 1) {
                        resolve();
                    }
                });
            });
        });
    }
}

export default Description;
