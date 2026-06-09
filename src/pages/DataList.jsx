import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DataList() {
  const [decks, setDecks] = useState([]);
  const [cardsCount, setCardsCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // uzimanje spilova i kartica
        const [decksRes, cardsRes] = await Promise.all([
          fetch('http://localhost:3000/decks'),
          fetch('http://localhost:3000/cards')
        ]);

        if (!decksRes.ok || !cardsRes.ok) {
          throw new Error('Nije uspelo preuzimanje podataka sa json-servera.');
        }

        const decksData = await decksRes.json();
        const cardsData = await cardsRes.json();

        // racunica za broj kartica 
        const counts = {};
        cardsData.forEach(card => {
          counts[card.deckId] = (counts[card.deckId] || 0) + 1;
        });

        setDecks(decksData);
        setCardsCount(counts);
        setError(null);
      } catch (err) {
        console.error('Greška pri preuzimanju:', err);
        setError(err.message || 'Došlo je do greške prilikom učitavanja podataka.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const getCardBg = (index) => {
    const bgs = ['bg-[#00f0b5]', 'bg-[#ffe600]', 'bg-[#ff4d00]', 'bg-white'];
    return bgs[index % bgs.length];
  };

  const getTextColor = (bg) => {
    return bg === 'bg-[#ff4d00]' ? 'text-white' : 'text-black';
  };

  const getBorderColor = (bg) => {
    return bg === 'bg-[#ff4d00]' ? 'border-white' : 'border-black';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-black pb-8 mb-12">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
            Dostupni Špilovi
          </h1>
          <p className="mt-2 text-sm text-slate-700 font-bold font-sans">
            Izaberi špil kartica za učenje i proveri koliko znas!
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-16 w-16 border-4 border-black border-t-[#ff4d00] rounded-full animate-spin bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
          <span className="mt-6 text-lg font-black uppercase tracking-wider">Učitavanje špilova...</span>
        </div>
      )}

      {error && (
        <div className="border-4 border-black bg-[#ff4d00] text-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
          <h3 className="text-2xl font-black uppercase mb-4">Greška pri učitavanju</h3>
          <p className="font-bold font-sans mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 border-2 border-white bg-white text-black text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150"
          >
            Pokušaj ponovo
          </button>
        </div>
      )}

      {/* Prazna lista */}
      {!loading && !error && decks.length === 0 && (
        <div className="border-4 border-black bg-white p-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
          <h3 className="text-2xl font-black uppercase mb-4">Nema pronađenih špilova</h3>
          <p className="font-bold text-slate-700 font-sans mb-6">Trenutno nema špilova u bazi</p>
        </div>
      )}

      {!loading && !error && decks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {decks.map((deck, idx) => {
            const cardBg = getCardBg(idx);
            const textColor = getTextColor(cardBg);
            const borderColor = getBorderColor(cardBg);
            const count = cardsCount[deck.id] || 0;

            return (
              <div
                key={deck.id}
                className={`border-4 border-black ${cardBg} p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150`}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className={`border-2 ${borderColor} bg-white text-black px-2 py-0.5 text-[10px] font-black uppercase`}>
                      Špil #{deck.id}
                    </span>

                  </div>

                  <h3 className={`text-2xl font-black uppercase tracking-tight leading-none mb-6 ${textColor}`}>
                    {deck.nazivPredmeta}
                  </h3>
                </div>

                <div className={`border-t-2 ${borderColor} pt-4 mt-6 flex justify-between items-center`}>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase ${textColor}`}>
                      Ukupno kartica
                    </span>
                    <span className={`text-2xl font-black ${textColor}`}>
                      {count}
                    </span>
                  </div>

                  <Link
                    to={`/decks/${deck.id}`}
                    className={`px-4 py-2 border-2 border-black bg-white text-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150`}
                  >
                    Otvori špil
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
