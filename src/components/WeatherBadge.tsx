import { DailyWeatherData, wmoIcon, wmoLabel } from '@/hooks/useWeather';

interface WeatherBadgeProps {
  date?: string;
  daily?: DailyWeatherData;
}

const WeatherBadge = ({ date, daily }: WeatherBadgeProps) => {
  const wx = date && daily ? daily[date] : null;

  if (wx) {
    return (
      <a
        href="https://www.windy.com/?43.463,-3.810,10"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-medium hover:bg-sky-100 transition-colors"
        aria-label="Прогноза за времето — Windy.com"
      >
        <span>{wmoIcon(wx.code)}</span>
        <span>{wmoLabel(wx.code)}</span>
        <span className="text-sky-500">·</span>
        <span>{wx.min}°–{wx.max}°C</span>
      </a>
    );
  }

  return (
    <a
      href="https://www.windy.com/?43.463,-3.810,10"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-600 text-xs font-medium hover:bg-sky-100 transition-colors"
    >
      🌡 Прогноза
    </a>
  );
};

export default WeatherBadge;
