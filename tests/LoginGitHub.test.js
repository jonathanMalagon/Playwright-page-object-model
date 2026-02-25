import { test } from '@playwright/test';

test('login GitHub', async ({ browser }) => {
  test.setTimeout(60000); // Aumentar timeout a 60 segundos
  
  const context = await browser.newContext({
    storageState: 'auth.json'
  })
  
  const page = await context.newPage();
  
  await page.goto('https://github.com/');
  await page.waitForLoadState('load');
 
});