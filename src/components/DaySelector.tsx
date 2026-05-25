import { motion } from 'framer-motion';
import { tripDays } from '@/data/tripData';

interface DaySelectorProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  showActive?: boolean;
}

const DaySelector = ({ selectedDay, onSelectDay, showActive = true }: DaySelectorProps) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-2 px-4 min-w-max">
        {tripDays.map((day) => (
          <motion.button
            key={day.day}
            onClick={() => onSelectDay(day.day)}
            className={`day-pill whitespace-nowrap ${
              showActive && selectedDay === day.day ? 'day-pill-active' : 'day-pill-inactive'
            }`}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <img src="guggenheim-icon.svg" alt="" className="w-4 h-4 object-contain" />
            <span className="font-semibold">Ден {day.day + 1}</span>
            <span className="hidden sm:inline text-xs opacity-80">{day.dateFormatted}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DaySelector;
