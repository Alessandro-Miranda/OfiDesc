import { IDescription } from './interfaces/IDescription';

class Description implements IDescription {
    private selectedOption: string;

    constructor(option: string) {
        this.selectedOption = option;
    }

    getArgs() {

    }

    generateCSV() {

    }

    generateHTML() {

    }

    saveFile() {

    }
}

export default Description;
