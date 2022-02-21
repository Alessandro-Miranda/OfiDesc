export interface IDescription {
    getArgs: () => void;
    generateHTMLFile: () => void;
    generateCSVFile: () => void;
    saveFile: () => Promise<void>;
    init: () => void;
}
