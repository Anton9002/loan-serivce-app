import {Page, Locator} from "@playwright/test";
import {SmallLoanPage} from "./small-loan.page";

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

    async openLoanDecisionPage(page: Page) {

        const smallLoanPage = new SmallLoanPage(page)

        await smallLoanPage.openSmallLoanPage()
        await smallLoanPage.clickCalculateButton();
        await smallLoanPage.clickApplyButton();
        await smallLoanPage.clickUserNamePasswordButton()
        await smallLoanPage.inputUserName('anna');
        await smallLoanPage.inputUserPassword('Tallinn1');
        await smallLoanPage.clickLoginContinueButton();

        return page

    }

    async clickLoanContinueButton() {

        await this.loanContinueButton.click();

    }

}