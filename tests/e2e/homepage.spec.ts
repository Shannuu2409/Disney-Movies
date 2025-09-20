import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display content', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads
    await expect(page).toHaveTitle(/Movie Web/);
    
    // Check if header elements are present
    await expect(page.locator('header')).toBeVisible();
    
    // Check if search input is present
    await expect(page.locator('input[placeholder="Search..."]')).toBeVisible();
    
    // Check if genre dropdown is present
    await expect(page.locator('text=Genre')).toBeVisible();
  });

  test('should navigate to search results', async ({ page }) => {
    await page.goto('/');
    
    // Type in search input
    await page.fill('input[placeholder="Search..."]', 'avengers');
    await page.press('input[placeholder="Search..."]', 'Enter');
    
    // Should navigate to search page
    await expect(page).toHaveURL(/\/search\/avengers/);
    await expect(page.locator('text=Results for "avengers"')).toBeVisible();
  });

  test('should open movie detail modal when clicking movie card', async ({ page }) => {
    await page.goto('/');
    
    // Wait for movies to load
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 10000 });
    
    // Click on first movie card
    const firstMovieCard = page.locator('[data-testid="movie-card"]').first();
    await firstMovieCard.click();
    
    // Check if modal opens
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('should display different content types', async ({ page }) => {
    await page.goto('/');
    
    // Check if different sections are present
    await expect(page.locator('text=Trending Movies')).toBeVisible();
    await expect(page.locator('text=Popular Movies')).toBeVisible();
  });
});
