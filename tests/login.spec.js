import { test, expect } from '../fixtures/fixtures';

test('login', async ({ loginPage }) => {
    await loginPage.login('013309', 'secrete');

//   await page.goto('https://myapexinternal.apexsystemsinc.com/psp/INTERNAL/?cmd=login&languageCd=ENG&');
//   await page.locator('#userid').click();
//   await page.locator('#userid').fill('013309');
//   await page.locator('#pwd').click();
//   await page.locator('#pwd').fill('secrete');
//   await page.getByRole('button', { name: 'Sign In' }).click();
});