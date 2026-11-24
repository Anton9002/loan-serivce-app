import { test, expect } from '@playwright/test';
import {SmallLoanPage} from "../src/small-loan.page";
import {LoanDecisionPage} from "../src/loan-decision.page";
import {IncomePage} from "../src/income.page";
import {DecisionPage} from "../src/decision.page";

test('small loan e2e flow', async ({ page }) => {

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
  await expect(decisionPage.decisionTitle).toBeVisible();
  await expect(decisionPage.decisionTitle).toContainText('Loan approved!');
  await expect(decisionPage.decisionText).toBeVisible();
  await expect(decisionPage.decisionText).toContainText('Your income is sufficient for this loan. We will contact you shortly.');

  await decisionPage.clickDecisionPageButton();

  await expect(page).toHaveURL('/small-loan')
  await expect(smallLoanPage.smallLoanCalculateText).toBeVisible();

});

test('calculate > apply button enabled > request happened', async ({ page }) => {

  const smallLoanPage = new SmallLoanPage(page);

  await smallLoanPage.openSmallLoanPage();

  const requestPromise = page.waitForRequest('**/api/loan-calc?amount=500&period=12');

  await smallLoanPage.clickCalculateButton();

  await requestPromise;

  await expect(smallLoanPage.applyButton).toBeEnabled();

  await smallLoanPage.inputAmount('1000');

  const request1KPromise = page.waitForRequest('**/api/loan-calc?amount=1000&period=12');

  await smallLoanPage.clickCalculateButton();

  await request1KPromise;

});

test('default state > calculate with mocked backend > monthly payment shown', async ({ page }) => {
  // mock backend response before navigation
  await page.route('**/api/loan-calc?amount=500&period=12', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ paymentAmountMonthly: 34.56 }),
    })
  })

  const smallLoanPage = new SmallLoanPage(page);

  await smallLoanPage.openSmallLoanPage();
  await smallLoanPage.clickCalculateButton();

  // mocked value is displayed
  await expect(smallLoanPage.monthlyPaymentText).toContainText('34.56')
});

test('calculation fails with an invalid amount and mocked backend > error is visible', async ({ page }) => {
  // mock backend response before navigation
  await page.route('**/api/loan-calc?amount=499&period=12', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',

    })
  })

  const smallLoanPage = new SmallLoanPage(page);

  await smallLoanPage.openSmallLoanPage();
  await smallLoanPage.inputAmount('499')
  await smallLoanPage.clickCalculateButton();

  // mocked value is displayed
  await expect(smallLoanPage.calculateErrorText).toBeVisible()

});

test('default state > change amount to 1000 > calculate with mocked backend > monthly payment shown', async ({ page }) => {
  // mock backend response before navigation
  await page.route('**/api/loan-calc?amount=1000&period=12', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ paymentAmountMonthly: 65.78 }),
    })
  })

  const smallLoanPage = new SmallLoanPage(page);

  await smallLoanPage.openSmallLoanPage();
  await smallLoanPage.clickCalculateButton();

  // mocked value is displayed
  await expect(smallLoanPage.monthlyPaymentText).toContainText('42.8')

  await smallLoanPage.inputAmount('1000')
  await smallLoanPage.clickCalculateButton();

  await expect(smallLoanPage.monthlyPaymentText).toContainText('65.78')

});

test('default state > approved decision is shown', async ({ page }) => {
  // mock backend response before navigation
  await page.route('**/api/decisions', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        approved: true,
        reason: 'approved'
      }),
    })
  })

  const smallLoanPage = new SmallLoanPage(page);

  const loanDecisionPage = await smallLoanPage.openLoanDecisionPage()

  await loanDecisionPage.clickLoanContinueButton()

  const incomePage = new IncomePage(page)

  await incomePage.fillMonthlyIncomeInput('500')
  await incomePage.clickIncomeGetDecisionButton()

  const decisionPage = new DecisionPage(page)

  await expect(decisionPage.decisionApprovedIcon).toBeVisible();
  await expect(decisionPage.decisionTitle).toBeVisible();
  await expect(decisionPage.decisionTitle).toContainText('Loan approved!');
  await expect(decisionPage.decisionText).toBeVisible();
  await expect(decisionPage.decisionText).toContainText('Your income is sufficient for this loan. We will contact you shortly.');

});

test('default state > declined decision is shown', async ({ page }) => {
  // mock backend response before navigation
  await page.route('**/api/decisions', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        approved: false,
        reason: 'insufficient_income'
      }),
    })
  })

  const smallLoanPage = new SmallLoanPage(page);

  const loanDecisionPage = await smallLoanPage.openLoanDecisionPage()

  await loanDecisionPage.clickLoanContinueButton()

  const incomePage = new IncomePage(page)

  await incomePage.fillMonthlyIncomeInput('1')
  await incomePage.clickIncomeGetDecisionButton()

  const decisionPage = new DecisionPage(page)

  await expect(decisionPage.decisionDeclinedIcon).toBeVisible();
  await expect(decisionPage.decisionTitle).toBeVisible();
  await expect(decisionPage.decisionTitle).toContainText('Loan declined');
  await expect(decisionPage.decisionText).toBeVisible();
  await expect(decisionPage.decisionText).toContainText('The monthly payment is too high compared to your income. Try a smaller amount or a longer period.');

});

