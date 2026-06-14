/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Greška pri učitavanju korisnika', error);
        localStorage.removeItem('auth_user');
      }
    }
    return null;
  });

  const [role, setRole] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        return parsedUser.role === 'Administrator' ? 'Administrator' : 'Korisnik';
      } catch (err) {
        console.error('Greška pri parsiranju uloge:', err);
      }
    }
    return null;
  });

  // Funkcija za login
  const login = async (usernameOrEmail, password, selectedRole, adminKey) => {
    try {
      const response = await fetch('http://localhost:3000/users');
      if (!response.ok) {
        throw new Error('Povezivanje sa serverom nije uspelo.');
      }

      const users = await response.json();

      // Provera emaila/username-a i lozinke 
      const foundUser = users.find((u) => {
        const matchIdentifier =
          (u.email && u.email.toLowerCase() === usernameOrEmail.toLowerCase()) ||
          (u.username && u.username.toLowerCase() === usernameOrEmail.toLowerCase());
        const matchPassword = u.password === password;
        return matchIdentifier && matchPassword;
      });

      if (!foundUser) {
        throw new Error('Pogrešan email/korisničko ime ili lozinka.');
      }

      // Provera prava i ključeva na osnovu izabrane uloge
      if (selectedRole === 'admin') {
        if (foundUser.role !== 'nastavnik' && foundUser.role !== 'admin') {
          throw new Error('Nemate administratorska prava pristupa.');
        }
        if (foundUser.adminKey !== adminKey) {
          throw new Error('Pogrešan pristupni ključ.');
        }
      } else {
        if (foundUser.role === 'nastavnik' || foundUser.role === 'admin') {
          throw new Error('Administratori se moraju prijaviti preko Admin panela.');
        }
      }


      const mappedRole = (foundUser.role === 'admin' || foundUser.role === 'nastavnik') ? 'Administrator' : 'Korisnik';

      // Kreiranje objekta ulogovanog korisnika sa mapiranom ulogom
      const loggedInUser = {
        ...foundUser,
        role: mappedRole
      };

      setUser(loggedInUser);
      setRole(mappedRole);

      // Čuvanje u localStorage
      localStorage.setItem('auth_user', JSON.stringify(loggedInUser));

      return loggedInUser;
    } catch (error) {
      console.error('Greška tokom prijave:', error.message);
      throw error;
    }
  };

  // Funkcija za registraciju 
  const register = async (userData) => {
    try {
      const responseUsers = await fetch('http://localhost:3000/users');
      if (!responseUsers.ok) {
        throw new Error('Povezivanje sa serverom nije uspelo.');
      }
      const users = await responseUsers.json();

      // Provera da li već postoji korisnik sa istim email-om ili korisničkim imenom
      const emailExists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
      const usernameExists = users.some(u => u.username && u.username.toLowerCase() === userData.username.toLowerCase());

      if (emailExists) {
        throw new Error('Korisnik sa ovom email adresom već postoji.');
      }
      if (usernameExists) {
        throw new Error('Korisnik sa ovim korisničkim imenom već postoji.');
      }

      const isTeacher = userData.role === 'admin';
      const dbRole = isTeacher ? 'nastavnik' : 'student';

      const newUser = {
        fullName: userData.fullName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: dbRole,
        ...(isTeacher
          ? {
            organization: userData.organization,
            adminRegCode: userData.adminRegCode,
            adminKey: userData.adminRegCode
          }
          : {
            institution: userData.institution,
            studyField: userData.studyField
          }
        )
      };

      const saveResponse = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (!saveResponse.ok) {
        throw new Error('Neuspešno upisivanje novog korisnika u bazu.');
      }

      const createdUser = await saveResponse.json();
      const mappedRole = isTeacher ? 'Administrator' : 'Korisnik';

      const loggedInUser = {
        ...createdUser,
        role: mappedRole
      };

      setUser(loggedInUser);
      setRole(mappedRole);
      localStorage.setItem('auth_user', JSON.stringify(loggedInUser));

      return loggedInUser;
    } catch (error) {
      console.error('Greška tokom registracije:', error.message);
      throw error;
    }
  };

  // Funkcija za logout
  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('auth_user');
  };

  // Funkcija za ažuriranje lozinke u sesiji
  const updatePassword = (newPassword) => {
    if (user) {
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth se mora koristiti unutar AuthProvider-a');
  }
  return context;
};
