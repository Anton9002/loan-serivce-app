import {Page, Locator} from "@playwright/test";

export class DecisionPage {

    readonly decisionPage: Page;
    readonly decisionApprovedIcon: Locator;
    readonly decisionTitle: Locator;
    readonly decisionText: Locator;
    readonly decisionDeclinedIcon: Locator;
    readonly decisionPageButton: Locator

    constructor(decisionPage: Page) {
        this.decisionPage = decisionPage;
        this.decisionApprovedIcon = decisionPage.getByTestId('decision-page-icon-approved');
        this.decisionTitle = decisionPage.getByTestId('decision-page-title');
        this.decisionText = decisionPage.getByTestId('decision-page-text');
        this.decisionDeclinedIcon = decisionPage.getByTestId('decision-page-icon-declined')
        this.decisionPageButton = decisionPage.getByTestId('decision-page-ok-button')
    }

    async clickDecisionPageButton() {

        await this.decisionPageButton.click();

    }
}