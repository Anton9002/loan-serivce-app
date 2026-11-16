import {Page, Locator} from "@playwright/test";

export class LoanDecisionPage {

    readonly loanDecisionPage: Page
    readonly loanDetailsText: Locator
    readonly finalAmountText: Locator
    readonly monthlyPaymentText: Locator
    readonly loanPeriodText: Locator
    readonly loanContinueButton: Locator

    constructor(loanDecisionPage: Page) {
        this.loanDecisionPage = loanDecisionPage;
        this.loanDetailsText = loanDecisionPage.getByTestId('final-page-loan-details-title');
        this.finalAmountText = loanDecisionPage.getByTestId('final-page-amount');
        this.monthlyPaymentText = loanDecisionPage.getByTestId('final-page-monthly-payment');
        this.loanPeriodText = loanDecisionPage.getByTestId('final-page-period');
        this.loanContinueButton = loanDecisionPage.getByTestId('final-page-continue-button');
    }

    async clickLoanContinueButton() {

        await this.loanContinueButton.click();

    }

}