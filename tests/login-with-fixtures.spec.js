import { test, expect } from '../fixtures/fixtures';

// Test usando fixture loginPage (solo inicializa la página)
test('login with loginPage fixture', async ({ loginPage }) => {
  await loginPage.login('013309', 'secrete');
  await expect(loginPage.page).not.toHaveURL(/.*login/);
});

// Test usando fixture authenticatedPage (login automático)
test('navigate to dashboard after authentication', async ({ authenticatedPage }) => {
  const url = authenticatedPage.url();
  expect(url).not.toContain('login');
});

// Test usando fixture con credentials personalizadas
test('login with custom credentials', async ({ loginPageWithCredentials }) => {
  const { loginPage, credentials } = loginPageWithCredentials;
  await loginPage.login(credentials.username, credentials.password);
  await expect(loginPage.page).not.toHaveURL(/.*login/);
});

// Test sin fixtures (estilo original)
test('login without fixtures', async ({ page }) => {
  const loginPage = new (require('../pages/InternalPortal')).LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.login('013309', 'secrete');
});
