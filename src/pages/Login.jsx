import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

export default function Login() {
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
    adminKey: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const loginSchema = yup.object().shape({
    usernameOrEmail: yup.string()
      .required('Korisničko ime ili email je obavezno polje')
      .test('valid-email-if-email', 'Uneti email nije validan', (value) => {
        if (!value) return true;
        // Ako sadrži @, proveravamo da li je u pitanju validan email
        if (value.includes('@')) {
          return yup.string().email().isValidSync(value);
        }
        return true;
      }),
    password: yup.string()
      .required('Lozinka je obavezno polje')
      .min(8, 'Lozinka mora imati najmanje 8 karaktera'),
    adminKey: role === 'admin'
      ? yup.string().required('Admin pristupni ključ je obavezan')
      : yup.string().notRequired(),
  });

  const validateField = async (name, currentData) => {
    try {
      await loginSchema.validateAt(name, currentData);
      setErrors((prev) => ({ ...prev, [name]: '' }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const validateForm = async (data) => {
    try {
      await loginSchema.validate(data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      if (err.inner) {
        err.inner.forEach((validationError) => {
          newErrors[validationError.path] = validationError.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedData);

    if (touched[name]) {
      validateField(name, updatedData);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData);
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData({
      usernameOrEmail: '',
      password: '',
      adminKey: '',
    });
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Označavamo sva polja kao taknuta
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      if (role === 'admin' || key !== 'adminKey') {
        allTouched[key] = true;
      }
    });
    setTouched(allTouched);

    const isValid = await validateForm(formData);
    if (!isValid) return;

    console.log('Login podaci:', { role, ...formData });
    alert(`Uspesna prijava kao ${role === 'user' ? 'Korisnik' : 'Administrator'}`);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-[#ebebeb] flex items-center justify-center p-6 font-mono">
      {/* Glavni kontejner */}
      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">

        {/* Dekorativno polje uloga*/}
        <div className="absolute top-0 right-0 border-l-4 border-b-4 border-black bg-[#ffe600] px-3 py-1 text-xs font-black uppercase">
          {role === 'user' ? 'Korisnik' : 'Admin'}
        </div>


        <div className="mb-8 mt-2">
          <h2 className="text-3xl font-black uppercase tracking-tight text-black">
            Prijavi se
          </h2>
          <p className="text-xs font-bold text-slate-700 mt-1 font-sans">
            Dobrodošli nazad.
          </p>
        </div>

        {/* Uloge selektor korisnik/admin */}
        <div className="grid grid-cols-2 gap-2 mb-6 border-b-4 border-dashed border-black/20 pb-6">
          <button
            type="button"
            onClick={() => handleRoleChange('user')}
            className={`py-2 px-4 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 ${role === 'user'
              ? 'bg-[#ffe600] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
              : 'bg-white text-black hover:bg-slate-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
          >
            Korisnik
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2 px-4 border-2 border-black text-xs font-black uppercase tracking-wider transition-all duration-150 ${role === 'admin'
              ? 'bg-[#00f0b5] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
              : 'bg-white text-black hover:bg-slate-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
          >
            Admin
          </button>
        </div>

        {/* Forma */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email/Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wide text-black">
              Korisničko ime ili Email
            </label>
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="unesite email ili korisničko ime"
              className="w-full border-2 border-black p-3 text-xs font-bold bg-white text-black focus:outline-none focus:bg-[#ffe600]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none placeholder-slate-400"
            />
            {touched.usernameOrEmail && errors.usernameOrEmail && (
              <p className="text-red-600 text-[10px] font-black uppercase tracking-wider mt-1">{errors.usernameOrEmail}</p>
            )}
          </div>

          {/* Lozinka */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-black uppercase tracking-wide text-black">
                Lozinka
              </label>
              <a
                href="#forgot"
                className="text-[10px] font-bold text-slate-700 hover:underline hover:text-black font-sans"
              >
                Zaboravili ste lozinku?
              </a>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              className="w-full border-2 border-black p-3 text-xs font-bold bg-white text-black focus:outline-none focus:bg-[#ffe600]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none placeholder-slate-400"
            />
            {touched.password && errors.password && (
              <p className="text-red-600 text-[10px] font-black uppercase tracking-wider mt-1">{errors.password}</p>
            )}
          </div>

          {/* PKljuc admin */}
          {role === 'admin' && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="block text-xs font-black uppercase tracking-wide text-black flex items-center gap-1.5">
                Admin Pristupni Ključ
                <span className="bg-[#ff4d00] text-white text-[9px] px-1 py-0.2">Obavezno</span>
              </label>
              <input
                type="password"
                name="adminKey"
                value={formData.adminKey}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Unesite tajni ključ"
                className="w-full border-2 border-black p-3 text-xs font-bold bg-white text-black focus:outline-none focus:bg-[#00f0b5]/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none placeholder-slate-400 border-[#00f0b5] shadow-[#00f0b5]"
              />
              {touched.adminKey && errors.adminKey && (
                <p className="text-red-600 text-[10px] font-black uppercase tracking-wider mt-1">{errors.adminKey}</p>
              )}
            </div>
          )}

          {/* Zapamti checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="remember"
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
              htmlFor="remember"
              className="text-xs font-bold text-black select-none cursor-pointer font-sans"
            >
              Zapamti me
            </label>
          </div>

          {/* Submit dugme */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 border-2 border-black font-black text-sm uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 ${role === 'user' ? 'bg-[#ff4d00]' : 'bg-[#00f0b5] text-black'
                }`}
            >
              Prijavi se
            </button>
          </div>
        </form>

        {/* Link za Registraciju */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-black/20 text-center">
          <p className="text-xs font-bold text-slate-800 font-sans">
            Nemate nalog?{' '}
            <Link
              to="/register"
              className="font-black text-[#ff4d00] hover:underline underline-offset-2 font-mono"
            >
              Registruj se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
