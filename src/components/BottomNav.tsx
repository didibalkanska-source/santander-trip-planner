import { Calendar, Map, ParkingCircle, Info } from 'lucide-react';

export type TabId = 'schedule' | 'map' | 'parking' | 'info';

interface BottomNavProps {
  activeTab: TabId | null;
  onTabChange: (tab: TabId) => void;
}

const dayTabs: { id: TabId; icon: React.ElementType; label: string }[] = [
  { id: 'schedule', icon: Calendar,       label: 'Програма' },
  { id: 'map',      icon: Map,            label: 'Карта' },
  { id: 'parking',  icon: ParkingCircle,  label: 'Паркинг' },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {

  const renderTab = (id: TabId, Icon: React.ElementType, label: string) => {
    const isActive = activeTab === id;
    return (
      <button
        key={id}
        onClick={() => onTabChange(id)}
        className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-all duration-200 ${
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-semibold">{label}</span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t z-50">
      <div className="flex items-center h-14 max-w-lg mx-auto">
        <div className="flex flex-1 justify-around items-center">
          {dayTabs.map(({ id, icon, label }) => renderTab(id, icon, label))}
        </div>
        <div className="w-px h-8 bg-border mx-1 flex-shrink-0" />
        {renderTab('info', Info, 'Инфо')}
      </div>
    </nav>
  );
};

export default BottomNav;
