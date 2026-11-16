import {Page, Locator} from "@playwright/test";

export class DecisionPage {

    readonly decisionPage: Page;
    readonly decisionApprovedIcon: Locator;
    readonly decisionApprovedText: Locator;
    readonly decisionPageButton: Locator

    constructor(decisionPage: Page) {
        this.decisionPage = decisionPage;
        this.decisionApprovedIcon = decisionPage.getByTestId('decision-page-icon-approved');
        this.decisionApprovedText = decisionPage.getByTestId('decision-page-title');
        this.decisionPageButton = decisionPage.getByTestId('decision-page-ok-button')
    }

    async clickDecisionPageButton() {

        await this.decisionPageButton.click();

    }
}