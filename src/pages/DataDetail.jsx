import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DataDetail() {
  const { id } = useParams();
  const { user, role } = useAuth();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stanja za učenje
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answeredCards, setAnsweredCards] = useState(new Set());
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [deckRating, setDeckRating] = useState(null); // 'easy' or 'hard'
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Stanja za novu karticu
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  useEffect(() => {
    const fetchDeckAndCards = async () => {
      try {
        setLoading(true);
        // Uzimanje detalja špila
        const deckRes = await fetch(`http://localhost:3000/decks/${id}`);
        if (!deckRes.ok) {
          throw new Error(`Špil sa ID-jem ${id} nije pronađen.`);
        }
        const deckData = await deckRes.json();

        // uzimanje svih kartica i filtriranje po id
        const cardsRes = await fetch(`http://localhost:3000/cards`);
        if (!cardsRes.ok) {
          throw new Error('Nije uspelo preuzimanje kartica.');
        }
        const allCards = await cardsRes.json();

        const filteredCards = allCards.filter(
          (card) => String(card.deckId) === String(deckData.id)
        );

        setDeck(deckData);
        setCards(filteredCards);
        setError(null);
      } catch (err) {
        console.error('Greška:', err);
        setError(err.message || 'Došlo je do greške prilikom učitavanja špila.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeckAndCards();
  }, [id]);


  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Označavanje odgovora
  const handleAnswer = (isCorrect) => {
    if (answeredCards.has(currentCardIdx)) return;

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    setAnsweredCards((prev) => {
      const updated = new Set(prev);
      updated.add(currentCardIdx);
      return updated;
    });

    setIsFlipped(true);
  };

  const saveSessionProgress = async (currentScore) => {
    if (!user) return;
    try {
      const targetDeckId = typeof deck.id === 'number' ? Number(deck.id) : deck.id;
      const targetUserId = typeof user.id === 'number' ? Number(user.id) : user.id;
      const pct = currentScore.total > 0 ? Math.round((currentScore.correct / currentScore.total) * 100) : 0;

      const sessionData = {
        userId: targetUserId,
        deckId: targetDeckId,
        deckName: deck.nazivPredmeta,
        correct: currentScore.correct,
        total: currentScore.total,
        percentage: pct,
        timestamp: new Date().toISOString(),
        rating: null
      };

      const response = await fetch('http://localhost:3000/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });

      if (response.ok) {
        const createdSession = await response.json();
        setCurrentSessionId(createdSession.id);
      }
    } catch (err) {
      console.error('Greška pri čuvanju sesije:', err);
    }
  };

  const handleRateDeck = async (ratingValue) => {
    setDeckRating(ratingValue);
    if (!currentSessionId) return;
    try {
      await fetch(`http://localhost:3000/sessions/${currentSessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating: ratingValue })
      });
    } catch (err) {
      console.error('Greška pri čuvanju ocene špila:', err);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentCardIdx < cards.length - 1) {
      setCurrentCardIdx(currentCardIdx + 1);
    } else {
      setIsSessionFinished(true);
      saveSessionProgress(score);
    }
  };

  const handleResetSession = () => {
    setCurrentCardIdx(0);
    setIsFlipped(false);
    setScore({ correct: 0, total: 0 });
    setAnsweredCards(new Set());
    setIsSessionFinished(false);
    setDeckRating(null);
    setCurrentSessionId(null);
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    const isOwner = deck && String(deck.authorId) === String(user?.id);
    if (role !== 'Administrator' && !isOwner) {
      setFormMessage({ type: 'error', text: 'Nemate privilegije za dodavanje kartica.' });
      return;
    }
    if (!newQuestion.trim() || !newAnswer.trim()) {
      setFormMessage({ type: 'error', text: 'Oba polja su obavezna!' });
      return;
    }

    try {
      setFormSubmitting(true);
      setFormMessage(null);

      const targetDeckId = typeof deck.id === 'number' ? Number(deck.id) : deck.id;

      const newCardObj = {
        deckId: targetDeckId,
        question: newQuestion.trim(),
        answer: newAnswer.trim()
      };

      const response = await fetch('http://localhost:3000/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCardObj)
      });

      if (!response.ok) {
        throw new Error('Čuvanje kartice nije uspelo.');
      }

      const savedCard = await response.json();


      setCards((prev) => [...prev, savedCard]);
      setNewQuestion('');
      setNewAnswer('');
      setFormMessage({ type: 'success', text: 'Kartica je uspešno dodata.' });

      // Poruka o uspesnosti se sklanja
      setTimeout(() => {
        setFormMessage(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setFormMessage({ type: 'error', text: err.message || 'Greška pri čuvanju kartice.' });
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center font-mono">
        <div className="h-16 w-16 mx-auto border-4 border-black border-t-[#00f0b5] rounded-full animate-spin bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
        <span className="mt-6 inline-block text-lg font-black uppercase tracking-wider">Učitavanje špila...</span>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 font-mono">
        <div className="border-4 border-black bg-[#ff4d00] text-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
          <h3 className="text-2xl font-black uppercase mb-4">Špil nije pronađen!</h3>
          <p className="font-bold font-sans mb-6">{error || 'Špil ne postoji.'}</p>
          <Link
            to="/decks"
            className="inline-block px-6 py-3 border-2 border-white bg-white text-black text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150"
          >
            Nazad na listu
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIdx];
  const hasAnsweredCurrent = answeredCards.has(currentCardIdx);
  const successRate = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-mono">
      {/* Dugme za nazad */}
      <div className="mb-8">
        <Link
          to="/decks"
          className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white text-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150"
        >
          ← Nazad na Špilove
        </Link>
      </div>

      {/* Detalji špila */}
      <div className="border-4 border-black bg-[#ffe600] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-12">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b-2 border-black pb-4 mb-4">
          <span className="border-2 border-black bg-white text-black px-2.5 py-0.5 text-xs font-black uppercase">
            Špil #{deck.id}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-black">
          {deck.nazivPredmeta}
        </h1>
        <p className="mt-4 text-xs font-bold text-slate-800 font-sans">
          Ukupno dostupnih kartica za vežbu u ovom špilu: <span className="font-mono font-black">{cards.length}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className={(role === 'Administrator' || (deck && String(deck.authorId) === String(user?.id))) ? "lg:col-span-7 space-y-8" : "lg:col-span-12 space-y-8 max-w-4xl mx-auto w-full"}>
          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-3 mb-6">
              Proveri znanje
            </h2>

            {cards.length === 0 ? (
              <div className="bg-[#ebebeb] p-8 text-center border-2 border-dashed border-black/30">
                <p className="font-bold text-slate-700 font-sans">
                  Ovaj špil još uvek nema kartice. Dodajte karticu.
                </p>
              </div>
            ) : isSessionFinished ? (
              <div className="space-y-8 py-4 text-center animate-fadeIn">
                <div className="inline-block border-2 border-black bg-[#ffe600] px-4 py-1 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  Sesija završena!
                </div>

                <div className="my-6">
                  <span className="text-[15px] font-black uppercase text-slate-500 block mb-1">Tvoj Uspeh</span>
                  <div className="text-6xl sm:text-7xl font-black text-black leading-none flex justify-center items-center gap-1">
                    <span>{successRate}</span>
                    <span className="text-3xl sm:text-4xl text-[#ff4d00]">%</span>
                  </div>
                </div>

                {/* Grafički prikaz progresa */}
                <div className="w-full max-w-md mx-auto border-4 border-black h-8 bg-white relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div
                    className="h-full bg-[#00f0b5] border-r-4 border-black transition-all duration-500"
                    style={{ width: `${successRate}%` }}
                  ></div>
                </div>

                <p className="text-sm font-black uppercase tracking-tight text-slate-800 max-w-md mx-auto px-4 py-2 border-2 border-black bg-[#ebebeb] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                  {successRate >= 90
                    ? "Odlično! Savladano je gradivo!"
                    : successRate >= 70
                      ? "Vrlo dobro! Još malo vežbe i biće savršeno."
                      : successRate >= 50
                        ? "Solidno, ali preporučujemo još jedno ponavljanje."
                        : "Potrebno je još rada."}
                </p>

                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-4 border-t-2 border-dashed border-black/20">
                  <div className="border-2 border-black bg-white p-3 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[9px] font-black uppercase text-slate-500 block mb-1">Ukupno</span>
                    <span className="text-xl font-black">{score.total}</span>
                  </div>
                  <div className="border-2 border-black bg-[#00f0b5] p-3 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[9px] font-black uppercase text-slate-500 block mb-1">Znam</span>
                    <span className="text-xl font-black">{score.correct}</span>
                  </div>
                  <div className="border-2 border-black bg-[#ff4d00] p-3 text-white shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[9px] font-black uppercase text-white/80 block mb-1">Ne znam</span>
                    <span className="text-xl font-black text-white">{score.total - score.correct}</span>
                  </div>
                </div>


                <div className="border-4 border-black bg-white p-4 max-w-md mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                  <span className="text-xs font-black uppercase text-black block">
                    Kako ocenjuješ težinu ovog špila?
                  </span>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleRateDeck('easy')}
                      className={`flex-grow py-2 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${deckRating === 'easy'
                        ? 'bg-[#00f0b5] text-black shadow-none translate-x-[1px] translate-y-[1px]'
                        : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'
                        }`}
                    >
                      Lako
                    </button>
                    <button
                      onClick={() => handleRateDeck('hard')}
                      className={`flex-grow py-2 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${deckRating === 'hard'
                        ? 'bg-[#ff4d00] text-white shadow-none translate-x-[1px] translate-y-[1px]'
                        : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'
                        }`}
                    >
                      Teško
                    </button>
                  </div>
                  {deckRating && (
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-700 mt-2">
                      Sačuvana ocena: {deckRating === 'easy' ? 'Lako' : 'Teško'}
                    </p>
                  )}
                </div>


                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 max-w-md mx-auto">
                  <button
                    onClick={handleResetSession}
                    className="flex-grow py-3 border-2 border-black bg-[#ffe600] text-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150 cursor-pointer"
                  >
                    Pokušaj ponovo
                  </button>
                  <Link
                    to="/decks"
                    className="flex-grow py-3 border-2 border-black bg-white text-black text-xs font-black uppercase tracking-wider text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150"
                  >
                    Nazad na Špilove
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Statistika sesije */}
                <div className="flex justify-between items-center bg-[#ebebeb] border-2 border-black p-3 text-xs font-bold">
                  <span>Kartica: {currentCardIdx + 1} od {cards.length}</span>
                  <span className="bg-[#00f0b5] border border-black px-2 py-0.5 text-black">
                    Rezultat: {score.correct} / {score.total} (tačnih)
                  </span>
                </div>

                <div className="perspective-1000 w-full h-[260px]">
                  <div
                    onClick={handleFlip}
                    className={`relative w-full h-full duration-500 preserve-3d cursor-pointer border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${isFlipped ? 'rotate-y-180' : ''
                      }`}
                  >
                    {/* Prednja strana za pitanje */}
                    <div className="absolute inset-0 w-full h-full bg-[#00f0b5] backface-hidden p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-center border-b border-black/40 pb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider">[ PITANJE ]</span>

                      </div>
                      <div className="my-auto text-center">
                        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-snug">
                          {currentCard.question}
                        </h3>
                      </div>
                      <div className="text-center text-[10px] font-black border-t border-black/20 pt-2 uppercase">
                        Klikni za odgovor
                      </div>
                    </div>

                    {/* Zadnja strana za odg */}
                    <div className="absolute inset-0 w-full h-full bg-[#ff4d00] text-white border-none rotate-y-180 backface-hidden p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-center border-b border-white/40 pb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider">[ ODGOVOR ]</span>

                      </div>
                      <div className="my-auto text-center">
                        <p className="text-sm sm:text-base font-black leading-relaxed uppercase">
                          {currentCard.answer}
                        </p>
                      </div>
                      <div className="text-center text-[10px] font-black border-t border-white/20 pt-2 uppercase text-white/90">
                        Klikni za pitanje
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kontrole */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="flex gap-2 flex-grow">
                    <button
                      onClick={() => handleAnswer(true)}
                      disabled={hasAnsweredCurrent}
                      className={`flex-grow py-3 border-2 border-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ${hasAnsweredCurrent
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none translate-x-[1px] translate-y-[1px]'
                        : 'bg-[#00f0b5] text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'
                        }`}
                    >
                      Znam
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      disabled={hasAnsweredCurrent}
                      className={`flex-grow py-3 border-2 border-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ${hasAnsweredCurrent
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none translate-x-[1px] translate-y-[1px]'
                        : 'bg-[#ff4d00] text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'
                        }`}
                    >
                      Ne znam
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleNext}
                      className={`px-6 py-3 border-2 border-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150 ${currentCardIdx === cards.length - 1 ? 'bg-[#ffe600] text-black' : 'bg-white text-black'
                        }`}
                    >
                      {currentCardIdx === cards.length - 1 ? 'Završi sesiju →' : 'Sledeća →'}
                    </button>
                    <button
                      onClick={handleResetSession}
                      className="px-4 py-3 border-2 border-black bg-black text-white text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150"
                      title="Resetuj sesiju"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lista svih kartica u špilu */}
          {cards.length > 0 && (
            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-black uppercase border-b-2 border-black pb-3 mb-6">
                Spisak Svih Kartica
              </h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {cards.map((card, idx) => (
                  <div key={card.id} className="border-2 border-black p-4 bg-[#ebebeb] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-white border border-black px-2 py-0.5 text-[9px] font-black uppercase">
                        Kartica #{idx + 1}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black"><span className="text-[#ff4d00]">P:</span> {card.question}</p>
                      <p className="text-xs font-bold font-sans text-slate-700"><span className="font-mono font-black text-[#00f0b5]">O:</span> {card.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Forma za dodavanje kartice */}
        {(role === 'Administrator' || (deck && String(deck.authorId) === String(user?.id))) && (
          <div className="lg:col-span-5">
            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-3 mb-6">
                + Dodaj Karticu
              </h2>
              <p className="text-xs font-bold text-slate-700 font-sans mb-6 leading-relaxed">
                Kreirajte novu karticu u ovom špilu.
              </p>

              <form onSubmit={handleAddCard} className="space-y-6">
                {/* Pitanje */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider">
                    Pitanje:
                  </label>
                  <textarea
                    rows="3"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="w-full border-4 border-black p-3 font-mono text-xs font-bold placeholder-slate-400 bg-[#ebebeb] focus:bg-white focus:outline-none focus:ring-0"
                  ></textarea>
                </div>

                {/* Odgovor */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider">
                    Odgovor:
                  </label>
                  <textarea
                    rows="3"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="w-full border-4 border-black p-3 font-mono text-xs font-bold placeholder-slate-400 bg-[#ebebeb] focus:bg-white focus:outline-none focus:ring-0"
                  ></textarea>
                </div>

                {/* Status poruka */}
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
                  className={`w-full py-3 border-4 border-black text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ${formSubmitting
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none translate-x-[2px] translate-y-[2px]'
                    : 'bg-[#ffe600] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                >
                  {formSubmitting ? 'Čuvanje...' : 'Sačuvaj Karticu'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
