import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../modules/Login.module.css';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main_container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.form_content}>
          <div className={styles.form_header}>
            <h1>Вход</h1>
          </div>

          {error && <div className={styles.error_message}>{error}</div>}

          <div className={styles.block_input}>
            <label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>

          <div className={styles.buttons_line}>
            <Link to="/register" className={styles.grey_button}>
              Зарегистрироваться
            </Link>
            <button
              type="submit"
              className={styles.yellow_button}
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
