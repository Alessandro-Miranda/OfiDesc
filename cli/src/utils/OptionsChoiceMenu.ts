import { stdin as input, stdout as output } from 'process';
import * as readline from 'readline';
import MenuOptions from '../types/menu';

/**
 * @classdesc Show the menu with file extension options
 */
class OptionsChoiceMenu {
    private selectedAwnserIndex = 1;

    private chosenAwnser = MenuOptions.CSVHTML;

    private optionsLength = 0;

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
        const MENU_KEYS = Object.keys(MenuOptions);
        this.optionsLength = MENU_KEYS.length;

        output.write(OptionsChoiceMenu.ansiEraseLines(MENU_KEYS.length));

        output.write('Escolha abaixo o tipo de arquivo que você deseja gerar (use as setas do teclado para navegar entre as opções):\n');

        readline.emitKeypressEvents(input);

        MENU_KEYS.forEach((option, index) => {
            const OPTION_KEY = option as keyof typeof MenuOptions;
            const TEXT = this.createText(MenuOptions[OPTION_KEY], index + 1);
            const OPTION_TEXT = (index + 1) === this.optionsLength ? TEXT : `${TEXT}\n`;
            output.write(OPTION_TEXT);
        });
    }

    /**
     * @description Format the text to be shown in the console
     * @param text - Text that'll be shown in the console
     * @param index - Actual option index
     * @returns Formated text with ASCII characters
     */
    private createText(text: string, index: number): string {
        return index === this.selectedAwnserIndex ? `\x1b[34m\x1b[4m> ${text}\x1b[0m` : `  ${text}\x1b[0m`;
    }

    /**
     * @description set the selected options
     * @param event Triggered keypress event
     * @param key key object
     */
    // eslint-disable-next-line class-methods-use-this
    private setResponse(event: KeyboardEvent, key: any): void {
        if (!key) return;

        const OPTIONS_KEYS = Object.keys(MenuOptions);

        if (key.name === 'up' && this.selectedAwnserIndex > 1) {
            this.selectedAwnserIndex -= 1;

            const OPTION = OPTIONS_KEYS[this.selectedAwnserIndex - 1] as keyof typeof MenuOptions;
            this.chosenAwnser = MenuOptions[OPTION];
        }

        if (key.name === 'down' && this.selectedAwnserIndex < this.optionsLength) {
            this.selectedAwnserIndex += 1;

            const OPTION = OPTIONS_KEYS[this.selectedAwnserIndex - 1] as keyof typeof MenuOptions;
            this.chosenAwnser = MenuOptions[OPTION];
        }

        if (key.name === 'escape' || (key.name === 'c' && key.ctrl)) {
            OptionsChoiceMenu.endProcess();
        }

        if (key.name === 'return') {
            // @ts-ignore
            process.send({
                selectedAwnser: this.chosenAwnser,
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
        const ERASE_LINE = `${ESC}2K`;
        const cursorUp = (c = 1) => `${ESC + c}A`;
        const CURSOR_LEFT = `${ESC}G`;

        let clear = '';

        for (let i = 0; i <= count; i++) {
            clear += ERASE_LINE + (i <= count - 1 ? cursorUp() : '');
        }

        if (count) {
            clear += CURSOR_LEFT;
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
