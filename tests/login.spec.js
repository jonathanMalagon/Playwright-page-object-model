import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/InternalPortal';

test('login', async ({ page }) => {

    const Login = new LoginPage(page)

    await Login.gotoLoginPage();
    await Login.login('013309', 'secrete');

//   await page.goto('https://myapexinternal.apexsystemsinc.com/psp/INTERNAL/?cmd=login&languageCd=ENG&');
//   await page.locator('#userid').click();
//   await page.locator('#userid').fill('013309');
//   await page.locator('#pwd').click();
//   await page.locator('#pwd').fill('secrete');
//   await page.getByRole('button', { name: 'Sign In' }).click();
});