import { beforeEach, describe, jest, test } from "@jest/globals";
import { OptionsChoiceMenu } from "../src/utils/OptionsChoiceMenu";

describe("Tests the options choice menu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const menu = new OptionsChoiceMenu();

  test.todo("Should return true if the options were successfully chosen");

  test.todo("Should return false if the options don't has successfully chosen");
});
