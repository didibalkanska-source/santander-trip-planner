import { useState, useEffect } from 'react';
import { tripDays } from '@/data/tripData';

export interface HourlyWeather {
  temp: number;
  code: number;
}

export interface DailyWeather {
  min: number;
  max: number;
  code: number;
}

export type WeatherData    = Record<string, Record<number, HourlyWeather>>;
export type DailyWeatherData = Record<string, DailyWeather>;

const WMO_ICON: Record<number, string> = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '🌨️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
};

const WMO_LABEL: Record<number, string> = {
  0: 'Ясно', 1: 'Предимно ясно', 2: 'Частична облачност', 3: 'Облачно',
  45: 'Мъгла', 48: 'Мъгла',
  51: 'Ситен дъжд', 53: 'Ситен дъжд', 55: 'Дъжд',
  61: 'Дъжд', 63: 'Дъжд', 65: 'Силен дъжд',
  71: 'Сняг', 73: 'Сняг', 75: 'Силен сняг',
  80: 'Дъждовни душове', 81: 'Дъждовни душове', 82: 'Бурни душове',
  95: 'Гръмотевична буря', 96: 'Гръмотевична буря', 99: 'Гръмотевична буря',
};

export const wmoIcon = (code: number): string =>
  WMO_ICON[code] ?? WMO_ICON[Math.floor(code / 10) * 10] ?? '🌡️';

export const wmoLabel = (code: number): string =>
  WMO_LABEL[code] ?? WMO_LABEL[Math.floor(code / 10) * 10] ?? '';

export const parseHour = (time: string): number | null => {
  const m = time.match(/^(\d{1,2}):/);
  if (!m) return null;
  return parseInt(m[1], 10);
};

export const useWeather = (): { data: WeatherData; daily: DailyWeatherData; loading: boolean } => {
  const [data,  setData]  = useState<WeatherData>({});
  const [daily, setDaily] = useState<DailyWeatherData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const hourlyResult: WeatherData     = {};
        const dailyResult: DailyWeatherData = {};

        await Promise.all(tripDays.map(async (day) => {
          const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${day.lat}&longitude=${day.lng}` +
            `&hourly=temperature_2m,weathercode` +
            `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
            `&timezone=Europe%2FMadrid` +
            `&forecast_days=16`;

          const res = await fetch(url);
          if (!res.ok || cancelled) return;
          const json = await res.json();

          // Hourly — store only for this day's date
          const times: string[]  = json.hourly.time;
          const temps: number[]  = json.hourly.temperature_2m;
          const codes: number[]  = json.hourly.weathercode;
          times.forEach((t, i) => {
            const [date, hourStr] = t.split('T');
            if (date !== day.date) return;
            const hour = parseInt(hourStr.split(':')[0], 10);
            if (!hourlyResult[date]) hourlyResult[date] = {};
            hourlyResult[date][hour] = { temp: Math.round(temps[i]), code: codes[i] };
          });

          // Daily — store only for this day's date
          const dDates: string[] = json.daily.time;
          const dMax: number[]   = json.daily.temperature_2m_max;
          const dMin: number[]   = json.daily.temperature_2m_min;
          const dCodes: number[] = json.daily.weathercode;
          dDates.forEach((d, i) => {
            if (d !== day.date) return;
            dailyResult[d] = {
              max: Math.round(dMax[i]),
              min: Math.round(dMin[i]),
              code: dCodes[i],
            };
          });
        }));

        if (!cancelled) {
          setData(hourlyResult);
          setDaily(dailyResult);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { data, daily, loading };
};
