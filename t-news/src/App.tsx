import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Profile } from './components/Profile';
import { PostForm } from './components/PostForm';
import { PostList } from './components/PostList';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="App">Загрузка...</div>;
  }

  return (
    <Router>
      <div className="App">
        <div className="main-container">
          <Header />
          <main className="main-content">
            <div className="container">
              <Routes>
                <Route
                  path="/login"
                  element={!user ? <LoginForm /> : <PostList />}
                />
                <Route
                  path="/register"
                  element={!user ? <RegisterForm /> : <PostList />}
                />
                <Route
                  path="/profile"
                  element={user ? <Profile /> : <LoginForm />}
                />
                <Route
                  path="/"
                  element={
                    user ? (
                      <div className="fade-in">
                        <PostList />
                        <PostForm />
                      </div>
                    ) : (
                      <LoginForm />
                    )
                  }
                />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
