import { tripSummary } from '@/data/tripData';
import { Hotel, Car, Utensils, Ticket, ExternalLink, Navigation, Map, Plane } from 'lucide-react';
const TripInfo = () => {
  return (
    <div className="px-4 space-y-4 pb-20">

      {/* 0. Полет */}
      <h2 className="font-display text-lg font-bold text-foreground mt-2">✈️ Полет</h2>
      <div className="bg-card border rounded-lg p-4 flex items-start gap-3">
        <Plane className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-semibold text-foreground">Директен полет · Потвърждение: <span className="text-primary font-bold tracking-wider">{tripSummary.flight.confirmation}</span></p>
          <p className="text-xs text-muted-foreground">✈ {tripSummary.flight.outbound}</p>
          <p className="text-xs text-muted-foreground">✈ {tripSummary.flight.inbound}</p>
          <p className="text-xs text-muted-foreground">2 пътника: BALKANSKA</p>
        </div>
      </div>

      {/* 1. Хотел */}
      <h2 className="font-display text-lg font-bold text-foreground mt-2">🏨 Хотел</h2>
      <a
        href={tripSummary.hotel.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${tripSummary.hotel.name} (отваря се в нов прозорец)`}
        className="flex items-center gap-3 bg-card border rounded-lg p-4 min-h-[56px] hover:shadow-md active:bg-muted/50 transition-all focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        <Hotel className="w-6 h-6 text-hotel flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{tripSummary.hotel.name}</p>
          <p className="text-xs text-muted-foreground">{tripSummary.hotel.address}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Check-in: {tripSummary.hotel.checkIn}
          </p>
          <p className="text-xs text-muted-foreground">
            Check-out: {tripSummary.hotel.checkOut}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
      </a>

      {/* 2. Бюджет */}
      <h2 className="font-display text-lg font-bold text-foreground mt-6">💶 Бюджет на човек</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Plane,    label: 'Самолет',          value: tripSummary.totalFlight, className: 'category-transport' },
          { icon: Car,      label: 'Кола под наем',    value: tripSummary.totalCar,    className: 'category-car' },
          { icon: Car,      label: 'Гориво (~750 км)', value: tripSummary.totalFuel,   className: 'category-transport' },
          { icon: Ticket,   label: 'Входове',          value: tripSummary.totalEntry,  className: 'category-sightseeing' },
          { icon: Utensils, label: 'Храна',            value: tripSummary.totalFood,   className: 'category-food' },
          { icon: Hotel,    label: 'Нощувки (3)',      value: tripSummary.totalHotel,  className: 'category-hotel' },
        ].map(({ icon: Icon, label, value, className }) => (
          <div key={label} className="bg-card border rounded-lg p-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${className}`}>
              <Icon className="w-4 h-4" aria-hidden="true" />
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-display font-bold text-lg text-foreground">€{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary/10 rounded-lg p-4 border">
        <p className="text-xs text-muted-foreground">Общо на човек (прибл.)</p>
        <p className="font-display font-bold text-2xl text-primary">€{tripSummary.grandTotal}</p>
        <p className="text-xs text-muted-foreground mt-1">За двама: ~€{tripSummary.grandTotal * tripSummary.people}</p>
      </div>

      {/* 3. Паркиране в Сантандер */}
      <h2 className="font-display text-lg font-bold text-foreground mt-6">🅿️ Паркиране в Сантандер</h2>
      <div className="bg-card border rounded-lg p-4 space-y-3">
        <div className="space-y-2">
          <p className="text-xs font-bold text-foreground uppercase tracking-wide">Синя зона (OLA) — платено е само:</p>
          <div className="space-y-1">
            {[
              { day: 'Пон – Пет', hours: '10:00–14:00 и 16:00–20:00' },
              { day: 'Събота',    hours: '10:00–14:00' },
              { day: 'Неделя и празници', hours: 'Безплатно цял ден 🎉' },
            ].map(({ day, hours }) => (
              <div key={day} className="flex items-center justify-between py-1 border-b last:border-0">
                <span className="text-xs font-medium text-foreground">{day}</span>
                <span className="text-xs text-muted-foreground">{hours}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1.5 pt-1">
          <p className="text-xs text-foreground/80">💰 Цена: <strong>€1.45/час</strong>, макс. 2 часа на едно място</p>
          <p className="text-xs text-foreground/80">🌙 Вечер от 20:00 до 10:00 сутринта — безплатно</p>
          <p className="text-xs text-foreground/80">🏖️ Район Сардинеро (плажовете) — безплатно целогодишно (без юли/август)</p>
          <p className="text-xs text-foreground/80">🟡 Жълта линия = забранено по всяко време</p>
          <p className="text-xs text-foreground/80">💳 Подземните паркинги приемат карти</p>
          <p className="text-xs text-foreground/80">📱 Приложение: <strong>OTSantander</strong> за плащане с телефон</p>
        </div>
      </div>

      {/* 4. Полезни връзки */}
      <h2 className="font-display text-lg font-bold text-foreground mt-6">🔗 Полезни връзки</h2>
      <nav aria-label="Полезни връзки" className="space-y-1">
        {[
          { label: 'Reservas Museo Altamira',      url: 'https://www.culturaydeporte.gob.es/mnaltamira/visita-el-museo/reservas.html' },
          { label: 'El Capricho de Gaudí – Билети', url: 'https://www.elcaprichodegaudi.com/' },
          { label: 'Centro Botín – Изкуство',       url: 'https://www.centrobotin.org/' },
          { label: 'Turismo de Cantabria',          url: 'https://www.turismodecantabria.com/' },
          { label: 'Google Maps – Santander',       url: 'https://www.google.com/maps/place/Santander,+Cantabria,+Spain' },
          { label: 'Parking Santander (мобилно)',   url: 'https://www.santander.es/tu-santander/tus-servicios/movilidad/parkings' },
          { label: 'Vueling – Проверка полет',      url: 'https://www.vueling.com/' },
          { label: 'Ryanair – Управление резерв.',  url: 'https://www.ryanair.com/bg/bg' },
        ].map(link => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label} (отваря се в нов прозорец)`}
            className="flex items-center gap-3 text-sm text-accent hover:text-primary hover:underline min-h-[44px] py-2 px-2 rounded-md active:bg-accent/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span className="flex-1">{link.label}</span>
          </a>
        ))}
      </nav>

      {/* 5. Приложения */}
      <h2 className="font-display text-lg font-bold text-foreground mt-6">📱 Полезни приложения</h2>
      <nav aria-label="Приложения" className="space-y-2">
        {[
          { icon: Map,        label: 'Google Maps (офлайн карти)',    desc: 'Свалете офлайн Santander + Cantabria',              url: 'https://www.google.com/maps',       color: 'text-primary' },
          { icon: Car,        label: 'Waze – навигация',              desc: 'Оптимален маршрут с трафик в реално време',          url: 'https://www.waze.com/',              color: 'text-primary' },
          { icon: Navigation, label: 'Maps.me (офлайн)',              desc: 'Подробни офлайн карти на Испания',                   url: 'https://maps.me/',                   color: 'text-primary' },
        ].map(({ icon: Icon, label, desc, url, color }) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} – ${desc} (отваря се в нов прозорец)`}
            className="flex items-center gap-3 bg-card border rounded-lg p-4 min-h-[56px] hover:shadow-md active:bg-muted/50 transition-all focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            <Icon className={`w-6 h-6 ${color} flex-shrink-0`} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
          </a>
        ))}
      </nav>

      {/* 6. Полезни фрази */}
      <h2 className="font-display text-lg font-bold text-foreground mt-6">🗣️ Полезни фрази на испански</h2>
      <div className="bg-card border rounded-lg p-4">
        <div className="space-y-2">
          {[
            { sp: '¿Dónde está...?',      bg: 'Къде е...?' },
            { sp: '¿Cuánto cuesta?',       bg: 'Колко струва?' },
            { sp: '¿Habla inglés?',        bg: 'Говорите ли английски?' },
            { sp: 'Una mesa para dos',      bg: 'Маса за двама' },
            { sp: 'La cuenta, por favor',   bg: 'Сметката, моля' },
            { sp: 'Sin gluten',             bg: 'Без глутен' },
            { sp: '¿Hay aparcamiento?',     bg: 'Има ли паркинг?' },
            { sp: 'Gracias / Por favor',    bg: 'Благодаря / Моля' },
          ].map(({ sp, bg }) => (
            <div key={sp} className="flex items-center gap-3 py-1 border-b last:border-0">
              <span className="text-sm font-bold text-primary w-40 flex-shrink-0 italic">{sp}</span>
              <p className="text-xs font-medium text-foreground">{bg}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TripInfo;
