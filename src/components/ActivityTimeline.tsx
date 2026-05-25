import { motion } from 'framer-motion';
import { Activity, ActivityCategory } from '@/data/tripData';
import {
  Plane, Car, Utensils, Hotel, Camera,
  Footprints, ExternalLink, Euro, ParkingCircle
} from 'lucide-react';
import { WeatherData, wmoIcon, parseHour } from '@/hooks/useWeather';

const categoryConfig: Record<ActivityCategory, { icon: React.ElementType; className: string; label: string; emoji: string }> = {
  flight:      { icon: Plane,         className: 'category-transport',   label: 'Полет',          emoji: '✈️' },
  transport:   { icon: Car,           className: 'category-transport',   label: 'Транспорт',      emoji: '🚌' },
  sightseeing: { icon: Camera,        className: 'category-sightseeing', label: 'Забележителност', emoji: '📍' },
  food:        { icon: Utensils,      className: 'category-food',        label: 'Храна',          emoji: '🍽️' },
  hotel:       { icon: Hotel,         className: 'category-hotel',       label: 'Хотел',          emoji: '🏨' },
  walk:        { icon: Footprints,    className: 'category-walk',        label: 'Разходка',       emoji: '🚶' },
  parking:     { icon: ParkingCircle, className: 'category-parking',     label: 'Паркинг',        emoji: '🅿️' },
  car:         { icon: Car,           className: 'category-car',         label: 'С кола',         emoji: '🚗' },
};

interface ActivityTimelineProps {
  activities: Activity[];
  onActivityClick?: (activity: Activity) => void;
  date?: string;
  weatherData?: WeatherData;
}

const ActivityTimeline = ({ activities, onActivityClick, date, weatherData }: ActivityTimelineProps) => {
  const dayWeather = date && weatherData ? weatherData[date] : null;

  const getWeather = (time: string) => {
    if (!dayWeather) return null;
    const hour = parseHour(time);
    if (hour === null) return null;
    return dayWeather[hour] ?? null;
  };

  return (
    <div className="relative pl-8 sm:pl-10">
      <div className="timeline-connector" />
      {activities.map((activity, index) => {
        const config = categoryConfig[activity.category];
        const Icon = config.icon;
        const wx = getWeather(activity.time);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`relative mb-3 cursor-pointer group ${activity.important ? 'important-activity' : ''}`}
            onClick={() => onActivityClick?.(activity)}
          >
            {/* Timeline dot */}
            <div className={`absolute -left-8 sm:-left-10 top-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center z-10 ${config.className} ${activity.important ? 'ring-2 ring-primary ring-offset-1' : ''}`}>
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>

            {/* Card */}
            <div className={`bg-card rounded-lg border p-2 sm:p-3 shadow-sm group-hover:shadow-md transition-shadow ml-1.5 sm:ml-2 ${activity.important ? 'border-primary/40 bg-primary/5' : ''}`}>
              <div className="flex items-start gap-1.5 sm:gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5">
                    <span className="text-[11px] sm:text-xs font-medium text-muted-foreground whitespace-nowrap">{activity.time}</span>
                    <span className={`text-[11px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded whitespace-nowrap ${config.className}`}>{config.label}</span>
                    {activity.free && (
                      <span className="text-[11px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded whitespace-nowrap bg-green-100 text-green-700 font-semibold">
                        Безплатно
                      </span>
                    )}
                    {activity.cost != null && activity.cost > 0 && (
                      <span className="text-[11px] sm:text-xs category-food px-1 sm:px-1.5 py-0.5 rounded flex items-center gap-0.5 whitespace-nowrap">
                        <Euro className="w-3 h-3" />{activity.cost}{activity.costNote ? ` (${activity.costNote})` : ''}
                      </span>
                    )}
                    {activity.important && (
                      <span className="text-[11px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded whitespace-nowrap bg-primary/10 text-primary font-semibold">
                        ⚠ Важно
                      </span>
                    )}
                    {wx && (
                      <span className="text-[11px] sm:text-xs px-1.5 py-0.5 rounded whitespace-nowrap bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                        {wmoIcon(wx.code)} {wx.temp}°C
                      </span>
                    )}
                  </div>
                  <h4 className="font-display font-semibold text-[13px] sm:text-sm text-foreground mt-0.5">{activity.title}</h4>
                  {activity.transport && (
                    <p className="text-sm text-foreground/70 mt-0.5">{activity.transport}</p>
                  )}
                  {activity.notes && (
                    <p className="text-sm text-foreground/70 mt-0.5 italic">{activity.notes}</p>
                  )}
                  {activity.alternatives && activity.alternatives.length > 0 && (
                    <div className="mt-2 border border-dashed border-muted-foreground/30 rounded-md p-2 bg-muted/30 space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Алтернативи</p>
                      {activity.alternatives.map((alt, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-[11px] text-foreground/70">{alt.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {activity.link && (
                  <a
                    href={activity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline flex-shrink-0 mt-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
