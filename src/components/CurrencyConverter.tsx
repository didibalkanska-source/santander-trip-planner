import { useState, useEffect } from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';

const FALLBACK_JPY_TO_EUR = 0.0054; // ~185 JPY per EUR

const CurrencyConverter = () => {
  const [jpy, setJpy] = useState('');
  const [jpyToEur, setJpyToEur] = useState(FALLBACK_JPY_TO_EUR);
  const [rateDate, setRateDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.frankfurter.dev/v1/latest?from=EUR&to=JPY');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (data.rates?.JPY) {
          setJpyToEur(1 / data.rates.JPY);
          setRateDate(data.date);
        }
      } catch {
        console.warn('Не може да се зареди курсът, използва се резервен.');
      } finally {
        setLoading(false);
      }
    };
    fetchRate();
  }, []);

  const eurValue = jpy ? (parseFloat(jpy) * jpyToEur).toFixed(2) : '0.00';
  const jpyPerEur = Math.round(1 / jpyToEur);

  return (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="font-display font-semibold text-sm text-foreground mb-1 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />
        </div>
        Конвертор JPY → EUR
      </h3>
      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
        {loading ? (
          <><RefreshCw className="w-3 h-3 animate-spin" /> Зареждане на курс…</>
        ) : rateDate ? (
          <>Актуален курс (ECB): 1 EUR ≈ {jpyPerEur} JPY</>
        ) : (
          <>Ориентировъчен курс: 1 EUR ≈ {jpyPerEur} JPY</>
        )}
      </p>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block font-medium">JPY (¥)</label>
          <input
            type="number"
            inputMode="numeric"
            value={jpy}
            onChange={(e) => setJpy(e.target.value)}
            placeholder="1000"
            className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <ArrowRightLeft className="w-4 h-4 text-muted-foreground mt-5 flex-shrink-0" />
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block font-medium">EUR (€)</label>
          <div className="w-full h-10 rounded-lg border border-input bg-secondary px-3 py-2 text-sm font-semibold text-foreground flex items-center">
            {eurValue}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[500, 1000, 2000, 3000, 5000, 10000].map(v => (
          <button
            key={v}
            onClick={() => setJpy(String(v))}
            className="text-xs py-1.5 rounded-lg border border-input bg-background hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all text-foreground font-medium"
          >
            ¥{v.toLocaleString()} → €{(v * jpyToEur).toFixed(0)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CurrencyConverter;
