import { expect, test } from '@playwright/test';

test.describe('price and quantities calculations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/cards/1');
    await page.getByRole('button', { name: 'Cart', exact: true }).click();
    await page.getByText('clear all').click();
    await page.goto('http://localhost:3000/cards/1');
  })

  test('users go to payment when place at least once item to card', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^\$ 2\.58Add to cart$/ }).getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('button', { name: 'Cart', exact: true }).click();
    await page.getByRole('button', { name: 'Continue to Payment' }).click();
    // Wait for the navigation to the payment URL
    await page.waitForURL('http://localhost:3000/payment');
    expect(page.url()).toBe('http://localhost:3000/payment');
  });

  test('calculates price correctly when add products', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^\$ 2\.58Add to cart$/ }).getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('div').filter({ hasText: /^\$ 0\.12Add to cart$/ }).getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('button', { name: 'Cart', exact: true }).click();
    expect(page.getByText('Total cart amount2')).toBeDefined()
    expect(('Total price$ 2.70')).toBeDefined()
  })

  test('calculates price correctly when change quantities', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^\$ 2\.58Add to cart$/ }).getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('button', { name: 'Cart', exact: true }).click();
    expect(page.getByText('Total cart amount1')).toBeDefined()
    expect(page.getByText('Total price$ 2.58')).toBeDefined()

    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();
    expect(page.getByText('Total cart amount4')).toBeDefined()
    expect(page.getByText('Total price$ 10.32')).toBeDefined()

    await page.getByRole('button', { name: '-' }).click();
    await page.getByRole('button', { name: '-' }).click();
    expect(page.getByText('Total cart amount2')).toBeDefined()
    expect(page.getByText('Total price$ 5.16')).toBeDefined()
  })

  test('calculates price correctly, when add products, and change quantities in any combination', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^\$ 2\.58Add to cart$/ }).getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('div').filter({ hasText: /^\$ 0\.12Add to cart$/ }).getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('div').filter({ hasText: /^\$ 0\.12Add to cart$/ }).getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('button', { name: 'Cart', exact: true }).click();
    await page.getByRole('cell', { name: '$ 2.58 +' }).getByRole('button', { name: '+' }).click();
    expect(page.getByText('Total price$ 5.40')).toBeDefined()
    expect(('Total cart amount4')).toBeDefined()

    await page.getByRole('cell', { name: '$ 2.58 +' }).getByRole('button', { name: '+' }).dblclick();
    await page.getByRole('button', { name: '+' }).nth(1).click();
    expect(('Total price$ 5.52')).toBeDefined()
    expect(('Total cart amount5')).toBeDefined()

    await page.getByRole('row', { name: 'Weedle - Weedle $ 0.12 2 $ 0.24 +' }).getByRole('button', { name: '-' }).click();
    await page.getByRole('cell', { name: 'Aggron -' }).getByRole('button', { name: '-' }).click();
    expect(('Total cart amount3')).toBeDefined()
    expect(('Total price$ 2.82')).toBeDefined()
  })
});

