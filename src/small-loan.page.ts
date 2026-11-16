import {Page, Locator} from "@playwright/test";

export class SmallLoanPage {

    readonly smallLoanPage: Page;
    readonly smallLoanCalculateText: Locator;
    readonly calculateButton: Locator
    readonly amountInput: Locator
    readonly applyButton: Locator
    readonly applyForLoanButton: Locator
    readonly userNameInput: Locator
    readonly userPasswordInput: Locator
    readonly loginContinueButton: Locator
    readonly smartIdButton: Locator
    readonly personalIdCodeInput: Locator
    readonly userNamePasswordButton: Locator

    constructor(smallLoanPage: Page) {
        this.smallLoanPage = smallLoanPage;
        this.smallLoanCalculateText = smallLoanPage.getByTestId('id-small-loan-calculator-title');
        this.calculateButton = smallLoanPage.getByTestId('id-small-loan-calculator-field-calculate');
        this.amountInput = smallLoanPage.getByTestId('id-small-loan-calculator-field-amount');
        this.applyButton = smallLoanPage.getByTestId('id-small-loan-calculator-field-apply');
        this.applyForLoanButton = smallLoanPage.getByTestId('id-image-element-button-image-1');
        this.userNameInput = smallLoanPage.getByTestId('login-popup-username-input');
        this.userPasswordInput = smallLoanPage.getByTestId('login-popup-password-input');
        this.loginContinueButton = smallLoanPage.getByTestId('login-popup-continue-button');
        this.smartIdButton = smallLoanPage.getByTestId('login-popup-tab-smart-id')
        this.personalIdCodeInput = smallLoanPage.getByTestId('login-popup-personal-code-input');
        this.userNamePasswordButton = smallLoanPage.getByTestId('login-popup-tab-password');

    }

    async openSmallLoanPage() {

        await this.smallLoanPage.goto('/small-loan')

    }

    async scrollToApplyForLoanButton() {

        await this.applyForLoanButton.scrollIntoViewIfNeeded();

    }

    async clickApplyForLoanButton() {

       await this.applyForLoanButton.click();

    }

    async clickCalculateButton() {

        await this.calculateButton.click();

    }

    async clickApplyButton() {

        await this.applyButton.click();

    }

    async clickSmartIdButton() {

        await this.smartIdButton.click();

    }

    async inputUserName(name: string) {

        await this.userNameInput.fill(name)

    }

    async inputUserPassword(password: string) {

        await this.userPasswordInput.fill(password)

    }

    async clickUserNamePasswordButton() {

        await this.userNamePasswordButton.click();

    }

    async clickLoginContinueButton() {

        await this.loginContinueButton.click();

    }

}