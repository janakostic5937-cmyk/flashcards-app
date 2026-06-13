import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [usersRes, decksRes, cardsRes] = await Promise.all([
          fetch('http://localhost:3000/users'),
          fetch('http://localhost:3000/decks'),
          fetch('http://localhost:3000/cards')
        ]);

        if (!usersRes.ok || !decksRes.ok || !cardsRes.ok) {
          throw new Error('Nije uspelo uzimanje podataka sa servera.');
        }

        const usersData = await usersRes.json();
        const decksData = await decksRes.json();
        const cardsData = await cardsRes.json();

        setUsers(usersData);
        setDecks(decksData);
        setCards(cardsData);
        setError(null);
      } catch (err) {
        console.error('Greška pri učitavanju podataka:', err);
        setError(err.message || 'Došlo je do greške prilikom učitavanja administratorskih podataka.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-mono">

      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white text-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150"
        >
          ← Nazad na Početnu
        </Link>
      </div>

      {/* Header */}
      <div className="border-4 border-black bg-[#00f0b5] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-12">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b-2 border-black pb-4 mb-4">
          <span className="border-2 border-black bg-white text-black px-2.5 py-0.5 text-xs font-black uppercase">
            Admin
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-black">
          Panel profesora
        </h1>
        <p className="mt-4 text-xs font-bold text-slate-800 font-sans">
          Za dodavanje novih pitanja, izaberite predmet za izmenu.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-16 w-16 border-4 border-black border-t-[#ffe600] rounded-full animate-spin bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
          <span className="mt-6 text-lg font-black uppercase tracking-wider">Učitavanje podataka...</span>
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

      {!loading && !error && (
        <div className="space-y-12">
          {/* Kartice sa statistikom */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div>
                <span className="inline-block border border-black bg-[#ffe600] px-2 py-0.5 text-[9px] font-black uppercase mb-4">
                  Korisnici
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Ukupno studenata</h3>
              </div>
              <div className="text-5xl font-black mt-4 border-t-2 border-dashed border-black/20 pt-4 flex justify-between items-baseline">
                <span>{users.length}</span>
                <span className="text-xs font-bold text-slate-500 font-sans">korisnika</span>
              </div>
            </div>


            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div>
                <span className="inline-block border border-black bg-[#00f0b5] px-2 py-0.5 text-[9px] font-black uppercase mb-4">
                  Špilovi
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Kreirani špilovi</h3>
              </div>
              <div className="text-5xl font-black mt-4 border-t-2 border-dashed border-black/20 pt-4 flex justify-between items-baseline">
                <span>{decks.length}</span>
                <span className="text-xs font-bold text-slate-500 font-sans">predmeta</span>
              </div>
            </div>


            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div>
                <span className="inline-block border border-black bg-[#ff4d00] text-white px-2 py-0.5 text-[9px] font-black uppercase mb-4">
                  Kartice
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Ukupno fleškartica</h3>
              </div>
              <div className="text-5xl font-black mt-4 border-t-2 border-dashed border-black/20 pt-4 flex justify-between items-baseline">
                <span>{cards.length}</span>
                <span className="text-xs font-bold text-slate-500 font-sans">kartica ukupno</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <div className="lg:col-span-8 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-3 mb-6">
                Registar studenata
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-4 border-black text-xs uppercase font-black bg-slate-100">
                      <th className="p-3">ID</th>
                      <th className="p-3">Ime/Email</th>
                      <th className="p-3">Uloga</th>
                      <th className="p-3">Rola</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((u) => u.role !== 'nastavnik' && u.role !== 'admin')
                      .map((u) => {
                        const isTeacher = u.role === 'nastavnik' || u.role === 'admin';
                        return (
                          <tr key={u.id} className="border-b-2 border-black hover:bg-slate-50 transition-colors">
                            <td className="p-3 text-xs font-black">#{u.id}</td>
                            <td className="p-3">
                              <div className="font-bold">{u.fullName || u.username || 'N/A'}</div>
                              <div className="text-[10px] text-slate-500 font-sans">{u.email}</div>
                            </td>
                            <td className="p-3">
                              <span className="text-xs font-bold bg-[#ebebeb] px-2 py-0.5 border border-black uppercase">
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`text-xs font-black px-2 py-0.5 border border-black uppercase ${isTeacher ? 'bg-[#00f0b5] text-black' : 'bg-[#ffe600] text-black'
                                  }`}
                              >
                                {isTeacher ? 'Administrator' : 'Korisnik'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>


            <div className="lg:col-span-4 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-3 mb-6">
                Špilovi
              </h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {decks.map((deck) => {
                  const deckCardsCount = cards.filter((c) => String(c.deckId) === String(deck.id)).length;
                  return (
                    <div
                      key={deck.id}
                      className="border-2 border-black p-4 bg-[#ebebeb] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-white border border-black px-2 py-0.5 text-[9px] font-black uppercase">
                          Špil #{deck.id}
                        </span>
                        <span className="text-xs font-black uppercase bg-[#ff4d00] text-white px-1.5 py-0.2">
                          {deckCardsCount} kartica
                        </span>
                      </div>
                      <h4 className="text-sm font-black uppercase">{deck.nazivPredmeta}</h4>
                      <div className="mt-4 flex justify-end">
                        <Link
                          to={`/decks/${deck.id}`}
                          className="px-3 py-1.5 border border-black bg-white text-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150"
                        >
                          Detalji
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
