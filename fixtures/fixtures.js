import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/InternalPortal';

export const test = base.extend({
  // Fixture para la página de login
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    
    // Setup - código que se ejecuta antes del test
    await loginPage.gotoLoginPage();
    
    // Usa la fixture en el test
    await use(loginPage);
    
    // Teardown - código que se ejecuta después del test
    // Aquí puedes limpiar/logout si es necesario
  },

  // Fixture para usuario autenticado
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    
    // Setup - navega y login automático
    await loginPage.gotoLoginPage();
    await loginPage.login('013309', 'secrete');
    
    // Espera a que la navegación sea completa
    await page.waitForLoadState('networkidle');
    
    await use(page);
    
    // Teardown - opcional: logout
    // await page.click('[logout-selector]');
  },

  // Fixture con credentials personalizadas
  loginPageWithCredentials: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    
    await use({ loginPage, credentials: { username: '013309', password: 'secrete' } });
  }
});

export { expect } from '@playwright/test';
