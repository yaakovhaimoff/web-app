const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('./model/ServiceAccount')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Get all books
app.get('/books', async (req, res) => {
  try {
    const booksSnapshot = await db.collection('books').get();
    const books = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add a new book
app.post('/books', async (req, res) => {
  try {
    const newBook = req.body;
    const docRef = await db.collection('books').add(newBook);
    res.status(201).json({ id: docRef.id, ...newBook });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a book
app.put('/books/:id', async (req, res) => {
  try {
    const updatedBook = req.body;
    const bookId = req.params.id;
    await db.collection('books').doc(bookId).update(updatedBook);
    res.json({ id: bookId, ...updatedBook });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
  try {
    console.log(req.params)
    const bookId = req.params.id;
    await db.collection('books').doc(bookId).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
