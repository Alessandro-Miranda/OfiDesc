import { fork } from 'child_process';
import Description from './description';

function main(option: string) {
    const description = new Description(option);
}

const ENV = process.env.NODE_ENV?.trimEnd().toLowerCase();
const optionsMenu = fork(`${__dirname}/utils/OptionsChoiceMenu${ENV === 'prod' ? '.js' : '.ts'}`, ['normal']);

let selectedOption = '';

optionsMenu.send({
    initProcess: true,
});

optionsMenu.on('message', (data: { selectedAwnser: string }) => {
    selectedOption = data.selectedAwnser;
});

optionsMenu.on('exit', () => {
    main(selectedOption);
});
