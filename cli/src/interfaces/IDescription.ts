export interface IDescription {
    getArgs: () => void;
    generateHTML: () => string;
    generateCSV: () => string;
    saveFile: () => void;
}
