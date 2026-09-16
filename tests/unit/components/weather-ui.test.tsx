import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LocationResults } from '../../../src/components/LocationResults';
import { SearchForm } from '../../../src/components/SearchForm';
import { StatusMessage } from '../../../src/components/StatusMessage';
import { UnitToggle } from '../../../src/components/UnitToggle';
import { WeatherPanel } from '../../../src/components/WeatherPanel';
import type { City, WeatherData } from '../../../src/types/weather';

describe('weather UI components', () => {
  it('submits a city query from SearchForm', () => {
    const onSubmit = vi.fn();
    render(<SearchForm value="" onChange={vi.fn()} onSubmit={onSubmit} />);

    expect(screen.getByRole('search', { name: 'Busca de cidade' })).toBeInTheDocument();
    const input = screen.getByLabelText('Cidade');
    fireEvent.change(input, { target: { value: 'Rio' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSubmit).toHaveBeenCalledWith('Rio');
  });

  it('shows retry and error message in StatusMessage', () => {
    const onRetry = vi.fn();
    render(
      <StatusMessage
        kind="error"
        message="Não foi possível consultar o serviço."
        retryable
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText('Não foi possível consultar o serviço.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('announces the provided loading message', () => {
    render(<StatusMessage kind="loading" message="Carregando clima..." />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando clima...');
  });

  it('allows selecting a city from LocationResults', () => {
    const cities: City[] = [
      {
        id: 1,
        name: 'São Paulo',
        latitude: -23,
        longitude: -46,
        timezone: 'America/Sao_Paulo',
        region: 'São Paulo',
        country: 'Brasil',
      },
      {
        id: 2,
        name: 'Rio de Janeiro',
        latitude: -22,
        longitude: -43,
        timezone: 'America/Sao_Paulo',
        region: 'Rio de Janeiro',
        country: 'Brasil',
      },
    ];
    const onSelect = vi.fn();

    render(<LocationResults cities={cities} onSelect={onSelect} />);

    expect(
      screen.getByRole('button', { name: 'Rio de Janeiro, Rio de Janeiro, Brasil' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Rio de Janeiro/i }));
    expect(onSelect).toHaveBeenCalledWith(cities[1]);
  });

  it('renders the current weather and five-day forecast', () => {
    const data: WeatherData = {
      city: {
        id: 1,
        name: 'São Paulo',
        latitude: -23,
        longitude: -46,
        timezone: 'America/Sao_Paulo',
      },
      current: { temperatureCelsius: 24.6, weatherCode: 0, condition: 'Céu limpo' },
      unit: 'celsius',
      forecast: [
        {
          date: '2026-09-16',
          minimumCelsius: 20,
          maximumCelsius: 27,
          weatherCode: 0,
          condition: 'Céu limpo',
          available: true,
          missingFields: [],
        },
        {
          date: '2026-09-17',
          minimumCelsius: 19,
          maximumCelsius: 28,
          weatherCode: 1,
          condition: 'Parcialmente nublado',
          available: true,
          missingFields: [],
        },
        {
          date: '2026-09-18',
          minimumCelsius: undefined,
          maximumCelsius: 30,
          weatherCode: undefined,
          condition: undefined,
          available: false,
          missingFields: ['minimum', 'condition'],
        },
        {
          date: '2026-09-19',
          minimumCelsius: 21,
          maximumCelsius: 29,
          weatherCode: 61,
          condition: 'Chuva leve',
          available: true,
          missingFields: [],
        },
        {
          date: '2026-09-20',
          minimumCelsius: 22,
          maximumCelsius: 31,
          weatherCode: 3,
          condition: 'Nublado',
          available: true,
          missingFields: [],
        },
      ],
    };

    render(<WeatherPanel data={data} unit="celsius" />);

    expect(screen.getByText('25°C')).toBeInTheDocument();
    expect(screen.getAllByText('Céu limpo')).toHaveLength(2);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('toggles unit selection using accessible button states', () => {
    const onChange = vi.fn();
    render(<UnitToggle unit="celsius" onChange={onChange} />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    const celsius = screen.getByRole('button', { name: 'Celsius' });
    const fahrenheit = screen.getByRole('button', { name: 'Fahrenheit' });

    expect(celsius).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(fahrenheit);
    expect(onChange).toHaveBeenCalledWith('fahrenheit');
  });
});
