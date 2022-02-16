import { stdin as input, stdout as output } from 'process';
import * as readline from 'readline';

const rl = readline.createInterface({
    input,
    output
});

input.setRawMode(true);
input.resume();
input.on('keypress', (event, key) => {
    console.log('pressionou');
    input.setRawMode(false);
    input.destroy();
})


// const questions = [
//     {
//         id: 1,
//         question: 'Você deseja salvar o código gerado em um arquivo do tipo CSV? (S/N)',
//         response: false,
//     },
//     {
//         id: 2,
//         question: 'Você deseja salvar o código gerado em um arquivo '
//     }
// ]

