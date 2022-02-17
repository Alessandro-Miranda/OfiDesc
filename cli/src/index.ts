import { fork } from 'child_process';

const ENV = process.env.NODE_ENV?.trimEnd().toLowerCase();
const optionsMenu = fork(`${__dirname}/utils/OptionsChoiceMenu${ENV === 'prod' ? '.js' : '.ts'}`, ['normal']);

optionsMenu.send({
    initProcess: true,
});

optionsMenu.on('message', (data) => {
    console.log(data);
});

optionsMenu.on('exit', () => {
    console.log('saiu');
});
