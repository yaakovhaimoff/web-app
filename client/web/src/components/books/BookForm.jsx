import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

const BookForm = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: ''
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/books/${id}`)
        .then(response => {
          setBook(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the book data!", error);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookData = {
      ...book,
      uploadedBy: currentUser.uid
    };

    if (id) {
      axios.put(`http://localhost:3000/books/${id}`, bookData)
        .then(() => {
          navigate('/');
        })
        .catch(error => {
          console.error("There was an error updating the book!", error);
        });
    } else {
      axios.post('http://localhost:3000/books', bookData)
        .then(() => {
          navigate('/');
        })
        .catch(error => {
          console.error("There was an error creating the book!", error);
        });
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit Book' : 'Add Book'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={book.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={book.author}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={book.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{id ? 'Update' : 'Add'} Book</button>
      </form>
    </div>
  );
};

export default BookForm;
