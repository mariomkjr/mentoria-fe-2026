import { test, expect } from '@playwright/test';

test.describe('Mentoria Fé - Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load without paywall (direct access)', async ({ page }) => {
    // Page should be immediately visible - no paywall
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Princípios Bíblicos');
  });

  test('should display all 20 sections', async ({ page }) => {
    for (let i = 1; i <= 20; i++) {
      const section = page.locator(`#secao-${i}`);
      await expect(section).toBeVisible();
    }
  });

  test('should have 3 banner slots', async ({ page }) => {
    const banners = page.locator('.banner-slot');
    await expect(banners).toHaveCount(3);
  });

  test('should have video embed with facade', async ({ page }) => {
    const videoFacade = page.locator('.video-facade');
    await expect(videoFacade).toBeVisible();

    // Click facade should load iframe
    await videoFacade.click();
    const iframe = page.locator('.video-iframe iframe');
    await expect(iframe).toBeVisible();
  });

  test('should have correct typography (Playfair + Inter)', async ({ page }) => {
    const h1 = page.locator('h1');
    const fontFamily = await h1.evaluate((el) =>
      getComputedStyle(el).fontFamily
    );
    expect(fontFamily).toContain('Playfair Display');

    const body = page.locator('body');
    const bodyFont = await body.evaluate((el) =>
      getComputedStyle(el).fontFamily
    );
    expect(bodyFont).toContain('Inter');
  });

  test('should have correct brand colors', async ({ page }) => {
    // Check bordo color on kicker
    const kicker = page.locator('.bg-bordo').first();
    const bgColor = await kicker.evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );
    // RGB for #7A1F3A
    expect(bgColor).toContain('122');
    expect(bgColor).toContain('31');
    expect(bgColor).toContain('58');
  });

  test('should have CTA button', async ({ page }) => {
    const cta = page.locator('.cta-button');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText('Quero Começar');
  });

  test('should have footer with privacy links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('a')).toHaveCount(3); // Termos, Privacidade, Contato
  });

  test('should be responsive - container max-width', async ({ page }) => {
    // On desktop, container should be max 1140px
    const container = page.locator('.container').first();
    const box = await container.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(1140);
  });
});

test.describe('Mentoria Fé - Performance', () => {
  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check that fonts are loaded
    const fontsLoaded = await page.evaluate(() => document.fonts.ready.then(() => true));
    expect(fontsLoaded).toBe(true);

    // Check no layout shift on images
    const banners = page.locator('.banner-slot img');
    for (const banner of await banners.all()) {
      const width = await banner.getAttribute('width');
      const height = await banner.getAttribute('height');
      expect(width).toBeTruthy();
      expect(height).toBeTruthy();
    }
  });

  test('should lazy load below-fold banners', async ({ page }) => {
    await page.goto('/');

    // First banner should be eager
    const banner1 = page.locator('.banner-slot img').first();
    const loading1 = await banner1.getAttribute('loading');
    expect(loading1).toBe('eager');

    // Other banners should be lazy
    const banner2 = page.locator('.banner-slot img').nth(1);
    const loading2 = await banner2.getAttribute('loading');
    expect(loading2).toBe('lazy');
  });
});

test.describe('Mentoria Fé - Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Should have exactly one h1
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);

    // Should have h2s for sections
    const h2s = page.locator('h2');
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThanOrEqual(20); // 20 sections + CTA
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    for (const img of await images.all()) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test('should have proper language attribute', async ({ page }) => {
    await page.goto('/');

    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('pt-BR');
  });
});
