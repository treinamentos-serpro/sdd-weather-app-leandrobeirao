import { expect, test } from '@playwright/test';

test('searches a city, selects it and shows the weather forecast', async ({ page }) => {
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        results: [
          {
            id: 3448439,
            name: 'São Paulo',
            latitude: -23.55,
            longitude: -46.64,
            timezone: 'America/Sao_Paulo',
            admin1: 'São Paulo',
            country: 'Brasil',
          },
        ],
      }),
    });
  });

  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        latitude: -23.55,
        longitude: -46.64,
        timezone: 'America/Sao_Paulo',
        current: {
          time: '2026-09-16T14:00',
          temperature_2m: 24.6,
          weather_code: 0,
        },
        daily: {
          time: ['2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'],
          temperature_2m_min: [20, 18, 19, 21, 22],
          temperature_2m_max: [27, 28, 30, 29, 31],
          weather_code: [0, 1, 3, 61, 0],
        },
      }),
    });
  });

  await page.goto('/');

  await page.getByRole('textbox', { name: 'Cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('button', { name: /São Paulo/i })).toBeVisible();
  await page.getByRole('button', { name: /São Paulo/i }).click();

  await expect(page.getByText('25°C')).toBeVisible();
  await expect(page.getByText('Céu limpo').first()).toBeVisible();
});

test('shows empty state when the search has no results', async ({ page }) => {
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ results: [] }),
    });
  });

  await page.goto('/');
  await page.getByRole('textbox', { name: 'Cidade' }).fill('Cidade inexistente');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByText('Nenhuma cidade encontrada')).toBeVisible();
});
