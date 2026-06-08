import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    // User polja
    institution: '',
    studyField: '',
    // Admin polja
    organization: '',
    adminRegCode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Lozinke se ne podudaraju');
      return;
    }
    console.log('Register podaci:', { role, ...formData });
    alert(`Registracija uspešna za ulogu: ${role === 'user' ? 'Korisnik' : 'Administrator'}`);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-[#ebebeb] flex items-center justify-center p-6 font-mono">
      {/* Glavni kontejner */}
      <div className="w-full max-w-xl bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">

        {/* Dekorativno polje uloga */}
        <div className="absolute top-0 right-0 border-l-4 border-b-4 border-black bg-[#ffe600] px-3 py-1 text-xs font-black uppercase">
          {role === 'user' ? 'Novi Korisnik' : 'Novi Admin'}
        </div>

        {/* Naslov */}
        <div className="mb-6 mt-2">
          <h2 className="text-3xl font-black uppercase tracking-tight text-black">
            Registracija
          </h2>
          <p className="text-xs font-bold text-slate-700 mt-1 font-sans">
            Kreirajte svoj nalog
          </p>
        </div>

        {/* Selektor za uloge admin/korisnik */}
        <div className="grid grid-cols-2 gap-2 mb-6 border-b-4 border-dashed border-black/20 pb-6">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`py-2 px-4 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 ${role === 'user'
              ? 'bg-[#ffe600] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
              : 'bg-white text-black hover:bg-slate-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
          >
            Korisnik
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2 px-4 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 ${role === 'admin'
              ? 'bg-[#00f0b5] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
              : 'bg-white text-black hover:bg-slate-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
          >
            Admin
          </button>
        </div>

        {/* Forma */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wide text-black">
                Ime i Prezime
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white text-black focus:outline-none focus:bg-[#ffe600]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none placeholder-slate-400"
              />
            </div>


            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wide text-black">
                Korisničko Ime
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}

                className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white text-black focus:outline-none focus:bg-[#ffe600]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none placeholder-slate-400"
              />
            </div>
          </div>


          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wide text-black">
              Email Adresa
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="email@primer.com"
              className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white text-black focus:outline-none focus:bg-[#ffe600]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wide text-black">
                Lozinka
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 karaktera"
                className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white text-black focus:outline-none focus:bg-[#ffe600]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none placeholder-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wide text-black">
                Potvrdi Lozinku
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white text-black focus:outline-none focus:bg-[#ffe600]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none placeholder-slate-400"
              />
            </div>
          </div>

          {/* Polja za korisnika */}
          {role === 'user' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dashed border-black/20 animate-fadeIn">

              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wide text-black">
                  Fakultet/Ustanova
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white text-black focus:outline-none focus:bg-[#ffe600]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none placeholder-slate-400"
                />
              </div>


              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wide text-black">
                  Smer/Godina
                </label>
                <input
                  type="text"
                  name="studyField"
                  value={formData.studyField}
                  onChange={handleChange}
                  placeholder="npr. SI / II godina"
                  className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white text-black focus:outline-none focus:bg-[#ffe600]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none placeholder-slate-400"
                />
              </div>
            </div>
          )}

          {/* Polja za admina */}
          {role === 'admin' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dashed border-[#00f0b5]/50 animate-fadeIn">

              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wide text-black">
                  Naziv Organizacije
                </label>
                <input
                  type="text"
                  name="organization"
                  required={role === 'admin'}
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="npr. Univerzitet u Beogradu"
                  className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white text-black focus:outline-none focus:bg-[#00f0b5]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none placeholder-slate-400 border-[#00f0b5] shadow-[#00f0b5]"
                />
              </div>


              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wide text-black flex items-center gap-1.5">
                  Admin Registracioni Kod
                  <span className="bg-[#ff4d00] text-white text-[9px] px-1 py-0.2">Obavezno</span>
                </label>
                <input
                  type="password"
                  name="adminRegCode"
                  required={role === 'admin'}
                  value={formData.adminRegCode}
                  onChange={handleChange}
                  placeholder="npr. REG-ADM-99"
                  className="w-full border-2 border-black p-2.5 text-xs font-bold bg-white text-black focus:outline-none focus:bg-[#00f0b5]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none placeholder-slate-400 border-[#00f0b5] shadow-[#00f0b5]"
                />
              </div>
            </div>
          )}


          <div className="flex items-start gap-2 pt-2">
            <div className="relative flex items-center mt-0.5">
              <input
                type="checkbox"
                required
                id="terms"
                className="peer h-5 w-5 cursor-pointer appearance-none border-2 border-black bg-white checked:bg-[#ff4d00] focus:outline-none transition-all duration-150"
              />
              <svg
                className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <label
              htmlFor="terms"
              className="text-xs font-bold text-black select-none cursor-pointer font-sans leading-tight"
            >
              Slažem se sa{' '}
              <a href="#terms" className="font-black text-black hover:underline">
                Uslovima Korišćenja
              </a>{' '}
              i{' '}
              <a href="#privacy" className="font-black text-black hover:underline">
                Politikom Privatnosti
              </a>
            </label>
          </div>

          {/* Submit dugme */}
          <div className="pt-3">
            <button
              type="submit"
              className={`w-full py-3.5 border-2 border-black font-black text-sm uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 ${role === 'user' ? 'bg-[#ff4d00]' : 'bg-[#00f0b5] text-black'
                }`}
            >
              Napravi nalog
            </button>
          </div>
        </form>

        {/* Link za Login */}
        <div className="mt-6 pt-5 border-t-2 border-dashed border-black/20 text-center">
          <p className="text-xs font-bold text-slate-800 font-sans">
            Već imate nalog?{' '}
            <Link
              to="/login"
              className="font-black text-[#ff4d00] hover:underline underline-offset-2 font-mono"
            >
              Prijavite se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
