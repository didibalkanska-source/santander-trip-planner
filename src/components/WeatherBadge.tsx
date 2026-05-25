import { Cloud } from 'lucide-react';

const WeatherBadge = () => {
  return (
    <a
      href="https://www.windy.com/?43.463,-3.810,10"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
      aria-label="Прогноза за времето в Сантандер — Windy.com"
    >
      <Cloud className="w-3.5 h-3.5" />
      Прогноза — Windy
    </a>
  );
};

export default WeatherBadge;
