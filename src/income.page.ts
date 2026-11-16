import {Page, Locator} from "@playwright/test";

export class IncomePage {

    readonly incomePage: Page;
    readonly yourMonthlyIncomeText: Locator;
    readonly incomeGetDecisionButton: Locator;
    readonly monthlyIncomeInput: Locator;

    constructor(incomePage: Page) {
        this.incomePage = incomePage;
        this.yourMonthlyIncomeText = incomePage.getByTestId('income-page-title');
        this.incomeGetDecisionButton = incomePage.getByTestId('income-page-submit-button');
        this.monthlyIncomeInput = incomePage.getByTestId('income-page-input');

    }

    async fillMonthlyIncomeInput(value: string): Promise<void> {

        await this.monthlyIncomeInput.fill(value);

    }

    async clickIncomeGetDecisionButton(): Promise<void> {

        await this.incomeGetDecisionButton.click();

    }
}