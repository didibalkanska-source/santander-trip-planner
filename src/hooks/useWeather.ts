import { useState, useEffect } from 'react';

export interface HourlyWeather {
  temp: number;
  code: number;
}

// date string (YYYY-MM-DD) -> hour (0-23) -> weather
export type WeatherData = Record<string, Record<number, HourlyWeather>>;

const WMO_ICON: Record<number, string> = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '🌨️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
};

export const wmoIcon = (code: number): string =>
  WMO_ICON[code] ?? WMO_ICON[Math.floor(code / 10) * 10] ?? '🌡️';

// Parse "HH:MM" or "HH:MM–HH:MM" → start hour number
export const parseHour = (time: string): number | null => {
  const m = time.match(/^(\d{1,2}):/);
  if (!m) return null;
  return parseInt(m[1], 10);
};

export const useWeather = (): { data: WeatherData; loading: boolean } => {
  const [data, setData] = useState<WeatherData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const url =
          'https://api.open-meteo.com/v1/forecast' +
          '?latitude=43.4628&longitude=-3.8100' +
          '&hourly=temperature_2m,weathercode' +
          '&timezone=Europe%2FMadrid' +
          '&start_date=2026-06-13&end_date=2026-06-16' +
          '&forecast_days=14';
        const res = await fetch(url);
        if (!res.ok || cancelled) return;
        const json = await res.json();
        const times: string[] = json.hourly.time;
        const temps: number[] = json.hourly.temperature_2m;
        const codes: number[] = json.hourly.weathercode;

        const result: WeatherData = {};
        times.forEach((t, i) => {
          const [date, hourStr] = t.split('T');
          const hour = parseInt(hourStr.split(':')[0], 10);
          if (!result[date]) result[date] = {};
          result[date][hour] = { temp: Math.round(temps[i]), code: codes[i] };
        });

        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { data, loading };
};
