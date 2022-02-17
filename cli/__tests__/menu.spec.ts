import { beforeEach, describe, jest, test } from '@jest/globals';
import OptionsChoiceMenu from '../src/utils/OptionsChoiceMenu';

jest.mock('process');
jest.mock('readline');

describe('Tests the options choice menu', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const menu = new OptionsChoiceMenu();

    test('Should return true if the options were successfully chosen', () => {
        menu.showMenu();
    });

    test.todo("Should return false if the options don't has successfully chosen");
});
