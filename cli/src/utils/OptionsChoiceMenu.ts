import { stdin as input, stdout as output } from 'process';
import * as readline from 'readline';

/**
 * @classdesc Show the menu with file extension options
 */
class OptionsChoiceMenu {
    private selectedAwnser = 1;

    private options = ['CSV + HTML', 'CSV', 'HTML'];

    /**
     * @constructor init the listener to keyboard events
     */
    constructor() {
        input.setRawMode(true);
        input.resume();
        input.on('keypress', this.setResponse.bind(this));
    }

    /**
     * @description write menu options in console
     */
    showMenu(): void {
        output.write(OptionsChoiceMenu.ansiEraseLines(this.options.length));

        output.write('Escolha abaixo o tipo de arquivo que você deseja gerar (use as setas do teclado para navegar entre as opções):\n');

        readline.emitKeypressEvents(input);

        this.options.forEach((option, index) => {
            const text = this.createText(option, index + 1);
            const optionText = (index + 1) === this.options.length ? text : `${text}\n`;
            output.write(optionText);
        });
    }

    /**
     * @description Format the text to be shown in the console
     * @param text - Text that'll be shown in the console
     * @param index - Actual option index
     * @returns Formated text with ASCII characters
     */
    private createText(text: string, index: number): string {
        return index === this.selectedAwnser ? `\x1b[34m\x1b[4m> ${text}\x1b[0m` : `  ${text}\x1b[0m`;
    }

    /**
     * @description set the selected options
     * @param event Triggered keypress event
     * @param key key object
     */
    // eslint-disable-next-line class-methods-use-this
    private setResponse(event: KeyboardEvent, key: any): void {
        if (!key) return;

        if (key.name === 'up' && this.selectedAwnser > 1) {
            this.selectedAwnser -= 1;
        }

        if (key.name === 'down' && this.selectedAwnser < this.options.length) {
            this.selectedAwnser += 1;
        }

        if (key.name === 'escape' || (key.name === 'c' && key.ctrl)) {
            OptionsChoiceMenu.endProcess();
        }

        if (key.name === 'return') {
            // @ts-ignore
            process.send({
                selectedAwnser: this.selectedAwnser,
            });
            OptionsChoiceMenu.endProcess();
        }

        this.showMenu();
    }

    /**
     * @description Clear the console lines to show new selected options
     * @param count Options length
     * @returns cleared string with ascii characters
     */
    private static ansiEraseLines(count: number) {
        // adapted from sindresorhus ansi-escape module
        const ESC = '\u001B[';
        const eraseLine = `${ESC}2K`;
        const cursorUp = (c = 1) => `${ESC + c}A`;
        const cursorLeft = `${ESC}G`;

        let clear = '';

        for (let i = 0; i <= count; i++) {
            clear += eraseLine + (i <= count - 1 ? cursorUp() : '');
        }

        if (count) {
            clear += cursorLeft;
        }

        return clear;
    }

    /**
     * @description End process and pause input
     */
    private static endProcess() {
        input.setRawMode(false);
        input.pause();
        process.exit(0);
    }
}

process.on('message', (data: { initProcess: boolean }) => {
    if (data.initProcess) {
        const menu = new OptionsChoiceMenu();

        menu.showMenu();
    }
});
