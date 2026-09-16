import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows weather after a valid city search and selection', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: [{ id: 1, name: 'São Paulo', latitude: -23.5, longitude: -46.6, timezone: 'America/Sao_Paulo', admin1: 'São Paulo', country: 'Brasil' }],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            latitude: -23.5,
            longitude: -46.6,
            timezone: 'America/Sao_Paulo',
            current: { time: '2026-09-16T14:00', temperature_2m: 24.6, weather_code: 0 },
            daily: {
              time: ['2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'],
              temperature_2m_min: [20, 18, 19, 21, 22],
              temperature_2m_max: [27, 28, 30, 29, 31],
              weather_code: [0, 1, 3, 61, 0],
            },
          }),
        }),
    );

    render(<App />);

    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'São Paulo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    await waitFor(() => expect(screen.getByRole('button', { name: /São Paulo/i })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /São Paulo/i }));

    await waitFor(() => expect(screen.getByText('25°C')).toBeInTheDocument());
  });
});
