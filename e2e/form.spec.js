import { test, expect } from '@playwright/test';

test.describe('Form Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/form/index.html');
  });

  test('page loads correctly', async ({ page }) => {
    await expect(page.locator('#dataForm')).toBeVisible();
    await expect(page.locator('#addAnakritikoi')).toBeVisible();
    await expect(page.locator('#removeAnakritikoi')).toBeVisible();
    await expect(page.locator('#submitForm')).toBeVisible();
  });

  test('add investigator row', async ({ page }) => {
    const initialRows = await page.locator('.anakritikoi-row').count();
    
    await page.click('#addAnakritikoi');
    
    const rowsAfterAdd = await page.locator('.anakritikoi-row').count();
    expect(rowsAfterAdd).toBe(initialRows + 1);
  });

  test('remove investigator row', async ({ page }) => {
    await page.click('#addAnakritikoi');
    const rowsAfterAdd = await page.locator('.anakritikoi-row').count();
    
    await page.click('#removeAnakritikoi');
    
    const rowsAfterRemove = await page.locator('.anakritikoi-row').count();
    expect(rowsAfterRemove).toBe(rowsAfterAdd - 1);
  });

  test('cannot remove last investigator row', async ({ page }) => {
    const initialRows = await page.locator('.anakritikoi-row').count();
    
    await page.click('#removeAnakritikoi');
    
    const rowsAfterRemove = await page.locator('.anakritikoi-row').count();
    expect(rowsAfterRemove).toBe(initialRows);
  });

  test('fill form and submit saves to localStorage', async ({ page }) => {
    await page.fill('#ypiresia', 'Test Department');
    await page.fill('#dAstynomias', 'Test Police');
    await page.fill('#doy', 'Test DOY');
    await page.fill('#xronosPeratosis', '15');
    
    await page.click('#submitForm');
    
    const data = await page.evaluate(() => 
      JSON.parse(localStorage.getItem('dataObject'))
    );
    
    expect(data.ypiresia).toBe('TEST DEPARTMENT');
    expect(data.dAstynomias).toBe('TEST POLICE');
    expect(data.doy).toBe('Test DOY');
    expect(data.xronosPeratosis).toBe(15);
  });

  test('theme toggle works', async ({ page }) => {
    const body = page.locator('body');
    const initialClasses = await body.getAttribute('class') || '';
    
    await page.click('#theme-toggle');
    
    const newClasses = await body.getAttribute('class') || '';
    expect(newClasses).not.toBe(initialClasses);
  });

  test('loads saved data from localStorage', async ({ page }) => {
    await page.goto('/form/index.html');
    
    await page.fill('#ypiresia', 'Saved Department');
    await page.fill('#dAstynomias', 'Saved Police');
    await page.fill('#xronosPeratosis', '20');
    await page.click('#submitForm');
    
    await page.reload();
    
    await expect(page.locator('#ypiresia')).toHaveValue('SAVED DEPARTMENT');
    await expect(page.locator('#dAstynomias')).toHaveValue('SAVED POLICE');
    await expect(page.locator('#xronosPeratosis')).toHaveValue('20');
  });
});
