import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DataList() {
  const { user, role } = useAuth();
  const [decks, setDecks] = useState([]);
  const [cardsCount, setCardsCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [newDeckName, setNewDeckName] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [decksRes, cardsRes, usersRes] = await Promise.all([
          fetch('http://localhost:3000/decks'),
          fetch('http://localhost:3000/cards'),
          fetch('http://localhost:3000/users')
        ]);

        if (!decksRes.ok || !cardsRes.ok || !usersRes.ok) {
          throw new Error('Nije uspelo preuzimanje podataka sa servera.');
        }

        const decksData = await decksRes.json();
        const cardsData = await cardsRes.json();
        const usersData = await usersRes.json();


        const usersMap = {};
        usersData.forEach((u) => {
          usersMap[u.id] = u.role;
        });


        const professorDecks = decksData.filter((deck) => {
          const creatorRole = usersMap[deck.authorId];
          return creatorRole === 'nastavnik' || creatorRole === 'admin' || !deck.authorId;
        });

        // Računica za broj kartica 
        const counts = {};
        cardsData.forEach((card) => {
          counts[card.deckId] = (counts[card.deckId] || 0) + 1;
        });

        setDecks(professorDecks);
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
  }, [retryTrigger]);

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeckName.trim()) {
      setFormMessage({ type: 'error', text: 'Naziv špila je obavezan!' });
      return;
    }

    try {
      setFormSubmitting(true);
      setFormMessage(null);

      const targetUserId = typeof user.id === 'number' ? Number(user.id) : user.id;

      const newDeckObj = {
        nazivPredmeta: newDeckName.trim(),
        authorId: targetUserId
      };

      const response = await fetch('http://localhost:3000/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDeckObj)
      });

      if (!response.ok) {
        throw new Error('Kreiranje špila nije uspelo.');
      }

      const createdDeck = await response.json();
      setDecks((prev) => [...prev, createdDeck]);
      setNewDeckName('');
      setFormMessage({ type: 'success', text: 'Zvanični špil je uspešno kreiran!' });

      setTimeout(() => {
        setFormMessage(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setFormMessage({ type: 'error', text: err.message || 'Greška pri kreiranju špila.' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const getCardBg = (index) => {
    const bgs = ['bg-[#00f0b5]', 'bg-[#ffe600]', 'bg-[#ff4d00]', 'bg-white'];
    return bgs[index % bgs.length];
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-black pb-8 mb-12">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
            Dostupni Špilovi
          </h1>
          <p className="mt-2 text-sm text-slate-700 font-bold font-sans">
            Izaberi špil kartica za učenje i proveri koliko znaš!
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
          <p className="font-bold font-sans mb-6 text-sm">{error}</p>
          <button
            onClick={() => setRetryTrigger((prev) => prev + 1)}
            className="px-6 py-3 border-2 border-white bg-white text-black text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150"
          >
            Pokušaj ponovo
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* lista špilova */}
          <div className={role === 'Administrator' ? 'lg:col-span-8 space-y-8' : 'lg:col-span-12'}>
            {decks.length === 0 ? (
              <div className="border-4 border-black bg-white p-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
                <h3 className="text-2xl font-black uppercase mb-4">Nema pronađenih špilova</h3>
                <p className="font-bold text-slate-700 font-sans text-xs">Trenutno nema zvaničnih špilova u bazi.</p>
              </div>
            ) : (
              <div className={role === 'Administrator' ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
                {decks.map((deck, idx) => {
                  const cardBg = getCardBg(idx);
                  const count = cardsCount[deck.id] || 0;

                  return (
                    <div
                      key={deck.id}
                      className={`border-4 border-black ${cardBg} p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <span className="border-2 border-black bg-white text-black px-2 py-0.5 text-[10px] font-black uppercase">
                            Špil #{deck.id}
                          </span>
                        </div>

                        <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-6 text-black">
                          {deck.nazivPredmeta}
                        </h3>
                      </div>

                      <div className="border-t-2 border-black pt-4 mt-6 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-black">
                            Ukupno kartica
                          </span>
                          <span className="text-2xl font-black text-black">
                            {count}
                          </span>
                        </div>

                        <Link
                          to={`/decks/${deck.id}`}
                          className="px-4 py-2 border-2 border-black bg-white text-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150"
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

          {/* admin deo za kreiranje */}
          {role === 'Administrator' && (
            <div className="lg:col-span-4">
              <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl font-black uppercase border-b-2 border-black pb-3 mb-6">
                  + Kreiraj špil
                </h2>
                <p className="text-xs font-bold text-slate-700 font-sans mb-6 leading-relaxed">
                  Kreirajte novi špil.
                </p>
                <form onSubmit={handleCreateDeck} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      Naziv špila:
                    </label>
                    <input
                      type="text"
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                      placeholder="npr. Fizika I"
                      className="w-full border-4 border-black p-3 font-mono text-xs font-bold bg-[#ebebeb] focus:bg-white focus:outline-none placeholder-slate-400"
                      required
                    />
                  </div>

                  {formMessage && (
                    <div
                      className={`border-2 border-black p-3 text-xs font-black uppercase ${formMessage.type === 'success' ? 'bg-[#00f0b5] text-black' : 'bg-[#ff4d00] text-white'
                        }`}
                    >
                      {formMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className={`w-full py-3 border-4 border-black text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 cursor-pointer ${formSubmitting
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none translate-x-[2px] translate-y-[2px]'
                      : 'bg-[#ffe600] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                  >
                    {formSubmitting ? 'Kreiranje...' : 'Sačuvaj špil'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
