import { test, expect } from '@playwright/test';
import {SmallLoanPage} from "../src/small-loan.page";
import {LoanDecisionPage} from "../src/loan-decision.page";
import {IncomePage} from "../src/income.page";
import {DecisionPage} from "../src/decision.page";

test.only('small loan e2e flow', async ({ page }) => {

  // the app default state

  const smallLoanPage = new SmallLoanPage(page)

  await smallLoanPage.openSmallLoanPage()

  await expect(smallLoanPage.calculateButton).toBeEnabled()
  await expect(smallLoanPage.applyButton).toBeDisabled()

  await smallLoanPage.scrollToApplyForLoanButton();
  await smallLoanPage.clickApplyForLoanButton();

  await expect(smallLoanPage.calculateButton).toBeInViewport();

  // login page default state

  await smallLoanPage.clickCalculateButton();
  await smallLoanPage.clickApplyButton();

  await expect(smallLoanPage.userNameInput).toBeVisible();
  await expect(smallLoanPage.userPasswordInput).toBeVisible();
  await expect(smallLoanPage.loginContinueButton).toBeDisabled();

  await smallLoanPage.clickSmartIdButton();

  await expect(smallLoanPage.personalIdCodeInput).toBeVisible();
  await expect(smallLoanPage.loginContinueButton).toBeDisabled();

  // login to the app

  await smallLoanPage.clickUserNamePasswordButton()
  await smallLoanPage.inputUserName('anna');
  await smallLoanPage.inputUserPassword('Tallinn1');
  await smallLoanPage.clickLoginContinueButton();

  await expect(page).toHaveURL('/loan-decision')

  const loanDecisionPage = new LoanDecisionPage(page)

  await expect(loanDecisionPage.loanDetailsText).toBeVisible()
  await expect(loanDecisionPage.finalAmountText).toHaveText('500 €');
  await expect(loanDecisionPage.monthlyPaymentText).toHaveText('42.8 €');
  await expect(loanDecisionPage.loanPeriodText).toHaveText('12 months')

  // open monthly income page

  await loanDecisionPage.clickLoanContinueButton();

  await expect(page).toHaveURL('/income')

  const incomePage = new IncomePage(page)

  await expect(incomePage.yourMonthlyIncomeText).toBeVisible();
  await expect(incomePage.incomeGetDecisionButton).toBeDisabled();

  // get decision

  await incomePage.fillMonthlyIncomeInput('1000');
  await incomePage.clickIncomeGetDecisionButton()

  await expect(page).toHaveURL('/decision')

  const decisionPage = new DecisionPage(page)

  await expect(decisionPage.decisionApprovedIcon).toBeVisible();
  await expect(decisionPage.decisionApprovedText).toBeVisible();

  await decisionPage.clickDecisionPageButton();

  await expect(page).toHaveURL('/small-loan')
  await expect(smallLoanPage.smallLoanCalculateText).toBeVisible();

});