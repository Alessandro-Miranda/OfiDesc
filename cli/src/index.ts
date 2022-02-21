import { fork } from 'child_process';
import Description from './description';

async function main(option: string) {
    const description = new Description(option);
    console.clear();
    console.info('Preparando local para salvar os arquivos');
    description.getArgs();
    console.info('Iniciando a geração dos arquivos. Por favor, aguarde um momento');
    await description.init();
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
    if (selectedOption) {
        main(selectedOption);
    }
});
