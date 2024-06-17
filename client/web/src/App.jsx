import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookList from './components/books/BookList';
import BookForm from './components/books/BookForm';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header";
import { AuthProvider } from './contexts/authContext/index';
import PrivateRoute from './contexts/authContext/PrivateRoute'; 

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <div className="w-full h-screen flex flex-col">
          <Routes>
            <Route path="*" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add" element={<PrivateRoute element={<BookForm />} />} />
            <Route path="/edit/:id" element={<PrivateRoute element={<BookForm />} />} />
            <Route path="/" element={<PrivateRoute element={<BookList />} />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
