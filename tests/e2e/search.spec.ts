import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should search for movies', async ({ page }) => {
    await page.goto('/search/avengers');
    
    // Check if search results page loads
    await expect(page.locator('text=Results for "avengers"')).toBeVisible();
    
    // Check if movie cards are displayed
    await expect(page.locator('[data-testid="movie-card"]')).toBeVisible();
  });

  test('should handle empty search results', async ({ page }) => {
    await page.goto('/search/nonexistentmovie12345');
    
    // Check if no results message is displayed
    await expect(page.locator('text=No results found')).toBeVisible();
  });

  test('should filter by content type', async ({ page }) => {
    await page.goto('/search/action');
    
    // Check if different content types are shown
    await expect(page.locator('text=Movies')).toBeVisible();
    await expect(page.locator('text=TV Shows')).toBeVisible();
  });
});


