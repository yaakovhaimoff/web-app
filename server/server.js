const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin with the service account
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};


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
