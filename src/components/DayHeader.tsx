import { motion } from 'framer-motion';
import { TripDay, tripDays, tripSummary } from '@/data/tripData';
import { Calendar, Hotel, ExternalLink, AlertTriangle } from 'lucide-react';
import WeatherBadge from './WeatherBadge';

interface DayHeaderProps {
  day: TripDay;
}

const DayHeader = ({ day }: DayHeaderProps) => {
  const isFirstDay = day.day === 0;
  const isLastDay = day.day === tripDays.length - 1;
  const showHotel = isFirstDay || isLastDay;

  return (
    <motion.div
      key={day.day}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4"
    >
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Ден {day.day + 1}: {day.title}
        </h2>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {day.dateFormatted} ({day.dayName})
          </span>
          <WeatherBadge />
        </div>
        {day.subtitle && (
          <p className="text-sm text-muted-foreground mt-1 italic">{day.subtitle}</p>
        )}
      </div>

      {day.warning && (
        <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-xs text-destructive font-medium">{day.warning}</p>
        </div>
      )}

      {showHotel && (
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-hotel-light border">
          <Hotel className="w-4 h-4 text-hotel flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{tripSummary.hotel.name}</p>
            <p className="text-xs text-muted-foreground">
              {isFirstDay
                ? `Check-in: ${tripSummary.hotel.checkIn}`
                : `Check-out: ${tripSummary.hotel.checkOut}`}
            </p>
          </div>
          <a
            href={tripSummary.hotel.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline flex-shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default DayHeader;
