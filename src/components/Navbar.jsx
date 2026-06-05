import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: 'Početna', path: '/' },
    { name: 'Špilovi', path: '/decks' },
    { name: 'Kartice', path: '/cards' },
    { name: 'Kviz', path: '/quiz' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b-4 border-black bg-white transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center border-4 border-black bg-[#ff4d00] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7 text-white"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </div>
              <span className="font-mono text-2xl font-black tracking-wider text-black">
                Flash Cards
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-black tracking-wider border-2 transition-all duration-200 ${isActive
                      ? 'bg-[#ffe600] text-black border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-black border-transparent hover:bg-[#ffe600]/20 hover:border-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 border-l-4 border-black pl-6">
              <Link
                to="/login"
                className="text-sm font-black tracking-wider text-black hover:underline decoration-4 decoration-[#ff4d00] underline-offset-4 transition-all duration-200"
              >
                Prijavi se
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 border-2 border-black bg-[#ff4d00] text-sm font-black tracking-wider text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150"
              >
                Započni sad
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center border-2 border-black bg-white p-2 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none focus:outline-none transition-all duration-150"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Otvori meni</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 border-b-4 border-black bg-white' : 'max-h-0'
          }`}
        id="mobile-menu"
      >
        <div className="space-y-1.5 px-4 pb-6 pt-3 border-t-2 border-black bg-[#f3f4f6]">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 border-2 text-base font-black tracking-wider transition-all duration-150 ${isActive
                  ? 'bg-[#ffe600] text-black border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black border-black hover:bg-[#ffe600] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t-2 border-dashed border-black/30">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center border-2 border-black bg-white py-3 text-center text-sm font-black tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150"
            >
              Prijavi se
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center border-2 border-black bg-[#ff4d00] py-3 text-center text-sm font-black tracking-wider text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-150"
            >
              Započni sada
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
