import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from '../modules/Header.module.css';
import logo from '../assets/t-bank.svg';
import profile from '../assets/Profile.svg';
import exit from '../assets/arrow-in-right.svg';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Поиск:', searchText);
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.logo}>
        <span className={styles.icon}>
          <img src={logo} alt="T-News Logo" className={styles.logoImage} />
        </span>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            className={styles.searchText}
            placeholder="Поиск по Т-News"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </form>
      </div>

      <div className={styles.menu}>
        {user ? (
          <>
            <span className={styles.userEmail}>{user.displayName}</span>
            <button
              className={styles.profileBtn}
              onClick={() => navigate('/profile')}
              title="Профиль"
            >
              <img src={profile} alt="Профиль" className={styles.profileIcon} />
            </button>
            <button
              className={styles.exitBtn}
              onClick={handleLogout}
              title="Выйти"
            >
              <img src={exit} alt="Выйти" className={styles.exitIcon} />
              Выйти
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.authBtn}
              onClick={() => navigate('/login')}
            >
              <img src={exit} alt="Войти" />
              Войти
            </button>
            <button
              className={styles.authBtn}
              onClick={() => navigate('/register')}
            >
              Регистрация
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
