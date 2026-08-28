import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyDecks() {
  const { user } = useAuth();
  const [myDecks, setMyDecks] = useState([]);
  const [cardsCount, setCardsCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newDeckName, setNewDeckName] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const filteredDecks = myDecks.filter((deck) =>
    deck.nazivPredmeta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchMyDecksAndCards = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [decksRes, cardsRes] = await Promise.all([
          fetch('http://localhost:3000/decks'),
          fetch('http://localhost:3000/cards')
        ]);

        if (!decksRes.ok || !cardsRes.ok) {
          throw new Error('Nije uspelo učitavanje podataka sa servera.');
        }

        const allDecks = await decksRes.json();
        const allCards = await cardsRes.json();


        const userDecks = allDecks.filter(
          (deck) => String(deck.authorId) === String(user.id)
        );

        // Računica za broj kartica
        const counts = {};
        allCards.forEach((card) => {
          counts[card.deckId] = (counts[card.deckId] || 0) + 1;
        });

        setMyDecks(userDecks);
        setCardsCount(counts);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Greška pri preuzimanju Vaših špilova.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyDecksAndCards();
  }, [user, retryTrigger]);

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
      setMyDecks((prev) => [...prev, createdDeck]);
      setNewDeckName('');
      setFormMessage({ type: 'success', text: 'Špil je uspešno kreiran!' });

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

  const handleDeleteDeck = async (deckId) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj špil?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/decks/${deckId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Brisanje špila nije uspelo.');
      }

      setMyDecks((prev) => prev.filter(deck => deck.id !== deckId));
      setFormMessage({ type: 'success', text: 'Špil je uspešno obrisan!' });
      setTimeout(() => setFormMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setFormMessage({ type: 'error', text: err.message || 'Greška pri brisanju špila.' });
      setTimeout(() => setFormMessage(null), 3000);
    }
  };

  const getCardBg = (index) => {
    const bgs = ['bg-[#00f0b5]', 'bg-[#ffe600]', 'bg-[#ff4d00]', 'bg-white'];
    return bgs[index % bgs.length];
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-mono">

      <div className="border-4 border-black bg-[#ff4d00] text-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-12">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b-2 border-white/40 pb-4 mb-4">
          <span className="border-2 border-white bg-white text-black px-2.5 py-0.5 text-xs font-black uppercase">
            Moji Špilovi
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-white">
          Moji Špilovi
        </h1>
        <p className="mt-4 text-xs font-bold text-slate-100 font-sans">
          Kreirajte i upravljajte sopstvenim špilovima kartica za učenje.
        </p>
      </div>

      {/* Pretraga špilova */}
      {!loading && !error && (
        <div className="mb-8 max-w-md">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
            Pretraži špil:
          </label>
          <div className="relative border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Unesite naziv špila"
              className="w-full px-4 py-3 font-mono text-xs font-bold focus:outline-none placeholder-slate-400 bg-white"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black uppercase hover:text-[#ff4d00] transition-colors cursor-pointer font-mono"
              >
                Ukloni
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lista špilova */}
        <div className="lg:col-span-8 space-y-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="h-16 w-16 border-4 border-black border-t-[#00f0b5] rounded-full animate-spin bg-white"></div>
              <span className="mt-6 text-sm font-black uppercase tracking-wider">Učitavanje špilova...</span>
            </div>
          )}

          {!loading && error && (
            <div className="border-4 border-black bg-[#ff4d00] text-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
              <h3 className="text-xl font-black uppercase mb-4">Greška</h3>
              <p className="font-bold font-sans mb-6 text-sm">{error}</p>
              <button
                onClick={() => setRetryTrigger((prev) => prev + 1)}
                className="px-6 py-3 border-2 border-white bg-white text-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150"
              >
                Pokušaj ponovo
              </button>
            </div>
          )}

          {!loading && !error && filteredDecks.length === 0 && (
            <div className="border-4 border-black bg-white p-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
              <h3 className="text-xl font-black uppercase mb-4">
                {myDecks.length === 0 ? 'Još uvek nemate dodate špilove' : 'Nema pronađenih špilova'}
              </h3>
              <p className="font-bold text-slate-700 font-sans text-xs mb-6">
                {myDecks.length === 0
                  ? 'Kreirajte svoj prvi špil koristeći formu sa desne strane.'
                  : 'Nijedan špil ne odgovara unetom kriterijumu pretrage.'}
              </p>
            </div>
          )}

          {!loading && !error && filteredDecks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredDecks.map((deck, idx) => {
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

                      <h3 className="text-xl font-black uppercase tracking-tight leading-none mb-6 text-black">
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

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteDeck(deck.id)}
                          className="px-3 py-2 border-2 border-black bg-[#ff4d00] text-white text-[10px] font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150 cursor-pointer"
                        >
                          Obriši
                        </button>
                        <Link
                          to={`/decks/${deck.id}`}
                          className="px-4 py-2 border-2 border-black bg-white text-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150"
                        >
                          Otvori špil
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Forma za kreiranje špila */}
        <div className="lg:col-span-4">
          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase border-b-2 border-black pb-3 mb-6">
              + Kreiraj špil
            </h2>
            <form onSubmit={handleCreateDeck} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Naziv špila:
                </label>
                <input
                  type="text"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder="npr. skripta za neki predmet"
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
      </div>
    </div>
  );
}
