import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWeatherApp } from '../../../src/hooks/useWeatherApp';

describe('useWeatherApp', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('changes unit without a service call', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const { result } = renderHook(() => useWeatherApp());

    act(() => {
      result.current.toggleUnit();
    });

    expect(result.current.unit).toBe('fahrenheit');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('validates empty input before calling the service', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { result } = renderHook(() => useWeatherApp());

    await act(async () => {
      await result.current.searchLocations('   ');
    });

    expect(result.current.state.kind).toBe('error');
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
