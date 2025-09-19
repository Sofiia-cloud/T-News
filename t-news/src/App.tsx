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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Загрузка...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-8 px-4">
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
                  <>
                    <PostForm />
                    <PostList />
                  </>
                ) : (
                  <LoginForm />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
