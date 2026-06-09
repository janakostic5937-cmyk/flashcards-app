import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DataList from './pages/DataList';
import DataDetail from './pages/DataDetail';

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
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/decks" element={<DataList />} />
              <Route path="/decks/:id" element={<DataDetail />} />
              {/* Dinamičke rute za privremeni prikaz ostalih stranica */}
              <Route path="/:pageName" element={<PagePlaceholder />} />
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

