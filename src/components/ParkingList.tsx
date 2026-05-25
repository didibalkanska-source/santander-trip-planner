import { motion } from 'framer-motion';
import { ParkingCircle, MapPin } from 'lucide-react';
import { TripDay } from '@/data/tripData';

interface ParkingListProps {
  day: TripDay;
}

const ParkingList = ({ day }: ParkingListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ParkingCircle className="w-5 h-5 text-primary" />
        <h2 className="font-display text-lg font-bold text-foreground">
          Паркинги – Ден {day.day + 1} ({day.dateFormatted})
        </h2>
      </div>

      {day.parking.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Няма записани паркинги за този ден.</p>
      ) : (
        <div className="space-y-3">
          {day.parking.map((spot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.25 }}
              className="bg-card border rounded-lg p-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${spot.free ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  <ParkingCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-foreground">{spot.name}</p>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${spot.free ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {spot.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{spot.address}</p>
                  </div>
                  {spot.notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">{spot.notes}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-card border rounded-lg p-3 mt-4">
        <h3 className="font-display font-semibold text-sm text-foreground mb-2">💡 Съвети за паркиране в Сантандер</h3>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>Синята зона (zona azul) е платена в делнични дни 8:00–21:00</li>
          <li>Жълтата линия = забранено паркиране по всяко време</li>
          <li>Повечето подземни паркинги приемат карти</li>
          <li>В неделя синята зона обикновено е безплатна</li>
          <li>Приложение: OTSantander за платено паркиране с телефон</li>
        </ul>
      </div>
    </div>
  );
};

export default ParkingList;
