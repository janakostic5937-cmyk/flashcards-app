import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DataList from './pages/DataList';
import DataDetail from './pages/DataDetail';
import Admin from './pages/Admin';

// komponenta za stranice
function PagePlaceholder() {
  const { pageName } = useParams();
  const titles = {
    decks: 'Špilovi',
    cards: 'Kartice',
    quiz: 'Kviz',
    login: 'Prijava',
    register: 'Registracija',
    terms: 'Uslovi Korišćenja',
    privacy: 'Politika Privatnosti',
    cookies: 'Podešavanja Kolačića',
    blog: 'Blog',
    community: 'Zajednica',
    faq: 'FAQ',
    help: 'Centar za Pomoć'
  };

  const displayName = titles[pageName] || 'Stranica';

  if (pageName === 'cards' || pageName === 'quiz') {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 font-mono text-center">
      <div className="border-4 border-black bg-white p-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-black uppercase mb-4">{displayName}</h1>
        <p className="font-bold text-slate-700 font-sans">Ova stranica je u pripremi (Placeholder).</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen flex-col bg-[#ebebeb] text-black selection:bg-[#ffe600] selection:text-black">
          {/* Navbar */}
          <Navbar />

          {/* Sadržaj */}
          <main className="flex-grow">
            <Routes>
              {/* Javno dostupne rute */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Zaštićene rute za registrovane korisnike */}
              <Route
                path="/decks"
                element={
                  <ProtectedRoute>
                    <DataList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/decks/:id"
                element={
                  <ProtectedRoute>
                    <DataDetail />
                  </ProtectedRoute>
                }
              />

              {/* Zaštićene rute za admine */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['Administrator']}>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* Privremen prikaz ostalih stranica */}
              <Route
                path="/:pageName"
                element={
                  <ProtectedRoute>
                    <PagePlaceholder />
                  </ProtectedRoute>
                }
              />

              {/* Fallback za nepostojeće rute */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

