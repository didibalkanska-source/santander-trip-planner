import { tripSummary } from '@/data/tripData';
import heroImg from '@/assets/hero-guggenheim.jpg';

const TripHeader = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-48 sm:h-56">
        <img
          src={heroImg}
          alt="Музей Гугенхайм Билбао"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
          Сантандер & Кантабрия
        </h1>
        <p className="text-base sm:text-lg text-white/90 mt-1 font-semibold drop-shadow-sm">
          13–16 юни 2026 · {tripSummary.nights} нощувки
        </p>
        <p className="text-sm text-white/80 mt-0.5 font-medium drop-shadow-sm">
          Испания · Кантабрийско море · Алтамира · Комиляс
        </p>
      </div>
    </div>
  );
};

export default TripHeader;
