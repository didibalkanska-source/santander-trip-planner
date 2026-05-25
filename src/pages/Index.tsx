import { useState, useCallback } from 'react';
import { tripDays, Activity } from '@/data/tripData';
import TripHeader from '@/components/TripHeader';
import DaySelector from '@/components/DaySelector';
import DayHeader from '@/components/DayHeader';
import ActivityTimeline from '@/components/ActivityTimeline';
import TripMap from '@/components/TripMap';
import TripInfo from '@/components/TripInfo';
import ParkingList from '@/components/ParkingList';
import BottomNav, { TabId } from '@/components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';

const Index = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>('schedule');
  const [focusedMarker, setFocusedMarker] = useState<Activity | null>(null);
  const { data: weatherData } = useWeather();

  const currentDay = tripDays[selectedDay] ?? tripDays[0];

  const handleSelectDay = useCallback((d: number) => {
    setSelectedDay(d);
    setFocusedMarker(null);
    setActiveTab(prev => prev === 'info' ? 'schedule' : prev);
  }, []);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
  }, []);

  const handleActivityClick = useCallback((activity: Activity) => {
    if (activity.lat && activity.lng) {
      setFocusedMarker(activity);
      setActiveTab('map');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background pb-16">
      <TripHeader />

      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b py-3">
        <DaySelector selectedDay={selectedDay} onSelectDay={handleSelectDay} showActive={activeTab !== 'info'} />
      </div>

      <div className="max-w-2xl mx-auto py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'schedule' && (
            <motion.div key="schedule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <DayHeader day={currentDay} />
              <div className="px-4">
                <ActivityTimeline activities={currentDay.activities} onActivityClick={handleActivityClick} date={currentDay.date} weatherData={weatherData} />
              </div>
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 flex flex-col gap-2 pb-4">
              <TripMap day={currentDay} focusedActivity={focusedMarker} height="460px" />
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-1">
                <div className="flex items-center gap-1.5">
                  <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="hsl(16 85% 50%)" strokeWidth="3" strokeLinecap="round"/></svg>
                  <span className="text-[11px] text-muted-foreground">С кола</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="hsl(168 100% 36%)" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round"/></svg>
                  <span className="text-[11px] text-muted-foreground">Пешеходно</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="hsl(221 83% 53%)" strokeWidth="2" strokeDasharray="5 8" strokeLinecap="round"/></svg>
                  <span className="text-[11px] text-muted-foreground">Полет</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div style={{width:16,height:16,background:'hsl(142 71% 45%)',borderRadius:3,display:'inline-flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:10,fontWeight:700}}>P</div>
                  <span className="text-[11px] text-muted-foreground">Паркинг (безпл.)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div style={{width:16,height:16,background:'hsl(220 10% 55%)',borderRadius:3,display:'inline-flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:10,fontWeight:700}}>P</div>
                  <span className="text-[11px] text-muted-foreground">Паркинг (платен)</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'parking' && (
            <motion.div key="parking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 space-y-4 pb-20">
              <ParkingList day={currentDay} />
            </motion.div>
          )}

          {activeTab === 'info' && (
            <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TripInfo />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
