import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { name: 'Početna', path: '/' },
    { name: 'Špilovi', path: '/decks' },
    { name: 'Moji špilovi', path: '/my-decks' },
  ];

  const communityLinks = [
    { name: 'Blog', path: '/blog' },
    { name: 'Zajedniza', path: '/community' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Pomoć', path: '/help' },
  ];

  const legalLinks = [
    { name: 'Uslovi korišćenja', path: '/terms' },
    { name: 'Politika privatnosti', path: '/privacy' },
    { name: 'Kolačići', path: '/cookies' },
  ];

  return (
    <footer className="w-full border-t-4 border-black bg-black text-slate-400 font-mono">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 xl:gap-8">

          {/* Brand i Tagline - Levi blok */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-max">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-white bg-[#ff4d00]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 text-white"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-wider text-white">
                Flash Cards
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-sans">
              Uči pametnije. Pamti brže. Platforma napravljena za studente.
            </p>

          </div>

          {/* Link stranice */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-black tracking-wider text-white border-l-2 border-[#00f0b5] pl-2">
              Stranica
            </h3>
            <ul className="space-y-2 text-xs">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-white hover:underline transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Link org */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-black tracking-wider text-white border-l-2 border-[#ffe600] pl-2">
              Organizacija
            </h3>
            <ul className="space-y-2 text-xs">
              {communityLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-white hover:underline transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pridruzi se forma */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-black tracking-wider text-white border-l-2 border-[#ff4d00] pl-2">
              Pridruži se
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Pretplatite se
            </p>
            <form className="flex max-w-md gap-0" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                className="w-full border-2 border-r-0 border-white bg-black px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
                placeholder="EMAIL_ADRESA"
              />
              <button
                type="submit"
                className="border-2 border-white bg-[#ff4d00] px-4 py-2 text-xs font-black text-white hover:bg-white hover:text-black transition-colors duration-150"
              >
                Prijavi
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px]">
          <p className="text-slate-500 order-2 md:order-1">
            &copy; {currentYear} Flash Cards. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 order-1 md:order-2">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-white hover:underline transition-colors duration-150"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
