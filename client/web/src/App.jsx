import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import {AppBar} from '@mui/material';

// import BookList from './components/books/BookList';
import BookForm from './components/books/BookForm';

import BookListing from './components/books/BookListing';
import BookDetails from './components/books/BookDetails';
import FilterOptions from './components/books/FilterOptions';

import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header";
import { AuthProvider } from './contexts/authContext/index';
import PrivateRoute from './contexts/authContext/PrivateRoute';


const App = () => {

  axios.defaults.withCredentials = true;
  const baseURL = "http://localhost:3000";

  const [userId, setUserId] = useState([])
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getUser();
    getBooks();
  }, []);

  const getBooks = () => {
    axios.get(`${baseURL}/books`)
      .then((response) => setBooks(response.data.Books))
      .catch((error) => console.error(error));
  }

  const getUser = () => {
    axios.get(`${baseURL}/user`).then((response) => {
      setUserId(response.data.id);
    }).catch(error => {
      console.log(error)
    });
  }

  const postBook = (title, author, publicationYear, description) => {
    axios.post(`${baseURL}/books`, {
      book: { title, author, publicationYear, description }
    }, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      setBooks([...books, response.data.book])
    }).catch(error => {
      console.log(error)
    });

  }

  const handleFilterChange = (publicationYear) => {
    const params = [];
    if (publicationYear) {
      params.push(`after=${publicationYear[0]}&before=${publicationYear[1]}`)
    }

    let url = `${baseURL}/books${params ? `?${params.join('&')}` : ``}`;
    axios.get(url)
      .then((response) => {
        setBooks(response.data.Books)
      })
      .catch((error) => console.error(error));
  }

  const renderToolBar = () => {
    return (
      <AppBar position="sticky" color='inherit'>
        <FilterOptions
          handleFilterChange={handleFilterChange} />
      </AppBar>
    );
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        {/* {renderToolBar()} */}
        <div className="w-full h-screen flex flex-col">
          <Routes>
            <Route path="*" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/add" element={<PrivateRoute element={<BookForm />} />} />
            <Route path="/edit/:id" element={<PrivateRoute element={<BookForm />} />} />
            {/* <Route path="/" element={<PrivateRoute element={<BookList />} />} /> */}

            <Route
              path="/"
              element={<PrivateRoute element={
                <BookListing
                  books={books}
                  postBook={postBook}
                  showTopReviewerBadge={
                    true // need to be changed the condition based on the instructions
                  } 
                  />} />
              }
            />

            <Route
              path="/book/:bookId"
              element={<PrivateRoute element={
                <BookDetails />
              } />} />

          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
