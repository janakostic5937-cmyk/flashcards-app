import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updatePassword } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setFormMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormMessage({ type: 'error', text: 'Sva polja su obavezna!' });
      return;
    }

    if (currentPassword !== user.password) {
      setFormMessage({ type: 'error', text: 'Trenutna lozinka nije ispravna.' });
      return;
    }

    if (newPassword.length < 8) {
      setFormMessage({ type: 'error', text: 'Nova lozinka must imati najmanje 8 karaktera.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormMessage({ type: 'error', text: 'Lozinke se ne podudaraju.' });
      return;
    }

    try {
      setFormSubmitting(true);
      const targetUserId = typeof user.id === 'number' ? Number(user.id) : user.id;

      const response = await fetch(`http://localhost:3000/users/${targetUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
      });

      if (!response.ok) {
        throw new Error('Čuvanje lozinke na serveru nije uspelo.');
      }

      updatePassword(newPassword);

      setFormMessage({ type: 'success', text: 'Lozinka je uspešno promenjena!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        setFormMessage(null);
      }, 4000);
    } catch (err) {
      console.error(err);
      setFormMessage({ type: 'error', text: err.message || 'Greška pri promeni lozinke.' });
    } finally {
      setFormSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchUserSessions = async () => {
      if (!user) return;
      try {
        setLoading(true);

        const targetUserId = typeof user.id === 'number' ? Number(user.id) : user.id;
        const response = await fetch(`http://localhost:3000/sessions?userId=${targetUserId}`);

        if (!response.ok) {
          throw new Error('Nije uspelo učitavanje istorije sesija.');
        }

        const data = await response.json();
        // Sortiranje po datumu za grafikon
        const sortedData = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setSessions(sortedData);
        setError(null);
      } catch (err) {
        console.error('Greška pri učitavanju istorije profila:', err);
        setError(err.message || 'Greška pri preuzimanju statistike.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserSessions();
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 font-mono text-center">
        <div className="border-4 border-black bg-white p-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black uppercase mb-4">Profil nije dostupan</h2>
          <p className="font-bold text-slate-700 font-sans mb-6">Morate biti prijavljeni da biste videli profil.</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 border-2 border-black bg-[#ff4d00] text-white text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150"
          >
            Prijavi se
          </Link>
        </div>
      </div>
    );
  }


  const totalSessions = sessions.length;
  const avgSuccess = totalSessions > 0
    ? Math.round(sessions.reduce((acc, curr) => acc + curr.percentage, 0) / totalSessions)
    : 0;

  const easyCount = sessions.filter(s => s.rating === 'easy').length;
  const hardCount = sessions.filter(s => s.rating === 'hard').length;

  // grafikon detalji
  const chartWidth = 600;
  const chartHeight = 250;
  const paddingX = 50;
  const paddingY = 40;

  const generateChartPoints = () => {
    if (sessions.length === 0) return '';

    // Ako ima samo 1 sesija, u sredini
    if (sessions.length === 1) {
      const x = chartWidth / 2;
      const y = chartHeight - paddingY - (sessions[0].percentage / 100) * (chartHeight - paddingY * 2);
      return [{ x, y, percentage: sessions[0].percentage, name: sessions[0].deckName, id: sessions[0].id }];
    }

    return sessions.map((s, idx) => {
      const x = paddingX + (idx / (sessions.length - 1)) * (chartWidth - paddingX * 2);
      const y = chartHeight - paddingY - (s.percentage / 100) * (chartHeight - paddingY * 2);
      return { x, y, percentage: s.percentage, name: s.deckName, id: s.id };
    });
  };

  const points = generateChartPoints();


  const linePathD = points.length > 1
    ? points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-mono">

      <div className="border-4 border-black bg-[#ffe600] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-12">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b-2 border-black pb-4 mb-4">
          <span className="border-2 border-black bg-white text-black px-2.5 py-0.5 text-xs font-black uppercase">
            Moj nalog
          </span>
          <span className="bg-black text-white px-2.5 py-0.5 text-xs font-black uppercase">
            {user.role}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-black">
          {user.fullName || user.username || 'Korisnički Profil'}
        </h1>
        <p className="mt-4 text-xs font-bold text-slate-800 font-sans">
          <span className="font-mono font-black">{user.email}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Licni podaci i stat */}
        <div className="lg:col-span-4 space-y-8">

          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase border-b-2 border-black pb-3 mb-6">
              Lični Podaci
            </h2>
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-black uppercase block">Ustanova</span>
                <span className="font-black text-sm uppercase">{user.institution || user.organization || 'Nije uneto'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-black uppercase block">Smer/Godina</span>
                <span className="font-black text-sm uppercase">{user.studyField || (user.role === 'Administrator' ? 'Nastavnik' : 'Student')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-black uppercase block">Status naloga</span>
                <span className="inline-block bg-[#00f0b5] border border-black px-2 py-0.5 font-black uppercase text-[9px] mt-1 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  Aktivan
                </span>
              </div>
            </div>
          </div>

          {/* Statistika */}
          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase border-b-2 border-black pb-3 mb-6">
              Rezime Učenja
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-black bg-[#ebebeb] p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[9px] text-slate-500 font-black uppercase block">Ukupno sesija</span>
                <span className="text-2xl font-black">{totalSessions}</span>
              </div>
              <div className="border-2 border-black bg-[#00f0b5] p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[9px] text-slate-500 font-black uppercase block">Prosečan uspeh</span>
                <span className="text-2xl font-black">{avgSuccess}%</span>
              </div>
              <div className="border-2 border-black bg-[#ffe600] p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[9px] text-slate-500 font-black uppercase block">Ocenjeno lako</span>
                <span className="text-2xl font-black">{easyCount}</span>
              </div>
              <div className="border-2 border-black bg-[#ff4d00] p-3 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[9px] text-white/80 font-black uppercase block">Ocenjeno teško</span>
                <span className="text-2xl font-black text-white">{hardCount}</span>
              </div>
            </div>
          </div>


          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase border-b-2 border-black pb-3 mb-6">
              Promena lozinke
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-slate-700">
                  Trenutna lozinka
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border-2 border-black p-2.5 text-xs font-bold bg-[#ebebeb] focus:bg-white focus:outline-none placeholder-slate-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[0.5px] focus:translate-y-[0.5px] focus:shadow-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-slate-700">
                  Nova lozinka
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 karaktera"
                  className="w-full border-2 border-black p-2.5 text-xs font-bold bg-[#ebebeb] focus:bg-white focus:outline-none placeholder-slate-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[0.5px] focus:translate-y-[0.5px] focus:shadow-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-slate-700">
                  Potvrdi novu lozinku
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-2 border-black p-2.5 text-xs font-bold bg-[#ebebeb] focus:bg-white focus:outline-none placeholder-slate-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[0.5px] focus:translate-y-[0.5px] focus:shadow-none"
                  required
                />
              </div>


              {formMessage && (
                <div
                  className={`border-2 border-black p-3 text-[10px] font-black uppercase ${formMessage.type === 'success' ? 'bg-[#00f0b5] text-black' : 'bg-[#ff4d00] text-white'
                    }`}
                >
                  {formMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={formSubmitting}
                className={`w-full py-3 border-2 border-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 cursor-pointer ${formSubmitting
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none translate-x-[1.5px] translate-y-[1.5px]'
                  : 'bg-[#ffe600] text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }`}
              >
                {formSubmitting ? 'Čuvanje...' : 'Sačuvaj lozinku'}
              </button>
            </form>
          </div>
        </div>

        {/* Grafikon i istorija */}
        <div className="lg:col-span-8 space-y-8">

          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase border-b-2 border-black pb-3 mb-6">
              Tvoj napredak
            </h2>

            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-10 w-10 border-4 border-black border-t-[#00f0b5] rounded-full animate-spin bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"></div>
                <span className="mt-4 text-xs font-black uppercase">Učitavanje grafikona...</span>
              </div>
            )}

            {!loading && error && (
              <div className="border-2 border-black bg-red-100 p-4 text-center text-xs font-black uppercase text-red-600">
                {error}
              </div>
            )}

            {!loading && !error && sessions.length === 0 && (
              <div className="bg-[#ebebeb] p-8 text-center border-2 border-dashed border-black/30">
                <p className="font-bold text-slate-700 font-sans mb-4">
                  Još uvek nema zabeleženih sesija.
                </p>
                <Link
                  to="/decks"
                  className="inline-block px-4 py-2 border-2 border-black bg-[#ffe600] text-black text-xs font-black uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150"
                >
                  Započni
                </Link>
              </div>
            )}

            {!loading && !error && sessions.length > 0 && (
              <div className="overflow-x-auto pt-4">
                <div className="min-w-[620px]">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible font-mono select-none">

                    {[0, 25, 50, 75, 100].map((pctValue) => {
                      const y = chartHeight - paddingY - (pctValue / 100) * (chartHeight - paddingY * 2);
                      return (
                        <g key={pctValue}>
                          <line
                            x1={paddingX}
                            y1={y}
                            x2={chartWidth - paddingX}
                            y2={y}
                            stroke="rgba(0, 0, 0, 0.15)"
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={paddingX - 10}
                            y={y + 4}
                            textAnchor="end"
                            className="text-[10px] font-black fill-slate-500"
                          >
                            {pctValue}%
                          </text>
                        </g>
                      );
                    })}

                    {/* Glavne ose */}
                    <line
                      x1={paddingX}
                      y1={chartHeight - paddingY}
                      x2={chartWidth - paddingX}
                      y2={chartHeight - paddingY}
                      stroke="black"
                      strokeWidth="3"
                    />
                    <line
                      x1={paddingX}
                      y1={paddingY}
                      x2={paddingX}
                      y2={chartHeight - paddingY}
                      stroke="black"
                      strokeWidth="3"
                    />

                    {/* Linija grafikona */}
                    {points.length > 1 && (
                      <path
                        d={linePathD}
                        fill="none"
                        stroke="black"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    {points.length > 1 && (
                      <path
                        d={linePathD}
                        fill="none"
                        stroke="#00f0b5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Tačke na grafikonu i procenti iznad njih */}
                    {points.map((p, idx) => (
                      <g key={p.id} className="group cursor-pointer">
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="8"
                          fill="black"
                        />
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="5"
                          fill={p.percentage >= 70 ? '#00f0b5' : p.percentage >= 50 ? '#ffe600' : '#ff4d00'}
                          className="hover:r-7 transition-all duration-150"
                        />


                        <text
                          x={p.x}
                          y={p.y - 12}
                          textAnchor="middle"
                          className="text-[10px] font-black fill-black"
                        >
                          {p.percentage}%
                        </text>

                        <text
                          x={p.x}
                          y={chartHeight - paddingY + 16}
                          textAnchor="middle"
                          className="text-[9px] font-black fill-slate-700"
                        >
                          #{idx + 1}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
                <div className="mt-4 bg-[#ebebeb] p-3 border-2 border-black text-[10px] font-bold text-slate-700 leading-relaxed font-sans">
                  Svaka tačka predstavlja završenu sesiju. Boja tačke ukazuje na uspešnost (zelena za visoku, žuta za srednju, crvena za nižu uspešnost).
                </div>
              </div>
            )}
          </div>


          {!loading && !error && sessions.length > 0 && (
            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-black uppercase border-b-2 border-black pb-3 mb-6">
                Istorija Sesija
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-4 border-black text-xs uppercase font-black bg-slate-100">
                      <th className="p-3">Sesija</th>
                      <th className="p-3">Predmet / Špil</th>
                      <th className="p-3">Rezultat</th>
                      <th className="p-3">Procenat</th>
                      <th className="p-3">Datum i Vreme</th>
                      <th className="p-3">Ocena</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.slice().reverse().map((s, idx) => {
                      const sessionNum = sessions.length - idx;
                      return (
                        <tr key={s.id} className="border-b-2 border-black hover:bg-slate-50 transition-colors">
                          <td className="p-3 text-xs font-black">#{sessionNum}</td>
                          <td className="p-3">
                            <span className="font-bold uppercase text-xs block">{s.deckName}</span>
                            <span className="text-[9px] text-slate-500 font-sans">ID špila: #{s.deckId}</span>
                          </td>
                          <td className="p-3 text-xs font-bold">
                            {s.correct} / {s.total} tačnih
                          </td>
                          <td className="p-3">
                            <span className={`text-xs font-black px-2 py-0.5 border border-black ${s.percentage >= 70 ? 'bg-[#00f0b5] text-black' : s.percentage >= 50 ? 'bg-[#ffe600] text-black' : 'bg-[#ff4d00] text-white'
                              }`}>
                              {s.percentage}%
                            </span>
                          </td>
                          <td className="p-3 text-xs font-sans text-slate-600 font-semibold">
                            {formatDate(s.timestamp)}
                          </td>
                          <td className="p-3">
                            {s.rating ? (
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black ${s.rating === 'easy' ? 'bg-[#00f0b5]/30 text-black' : 'bg-[#ff4d00]/20 text-black'
                                }`}>
                                {s.rating === 'easy' ? 'Lako' : 'Teško'}
                              </span>
                            ) : (
                              <span></span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
