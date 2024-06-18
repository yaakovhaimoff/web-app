const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('./model/ServiceAccount')
const {Books} = require("./model/Books");
const {Reviews} = require("./model/Reviews");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = admin.firestore();

const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

const baseURL = "http://localhost:5173";

const corsOptions = {
    origin: baseURL,
    credentials: true
}

app.get("/", cors(corsOptions), (req, res) => {
    res.send("Welcome to your Wix Enter exam!");
});

app.get("/user", cors(corsOptions), (req, res) => {
    const userId = req.cookies?.userId || uuidv4();
    res.cookie("userId", userId).send({id: userId});
});

app.get('/books', cors(corsOptions), (req, res) => {
    let booksToReturn = Books;
    const {after} = req.query
    if (after) {
        booksToReturn = booksToReturn.filter((book) => book.publicationYear === after)
    }

    res.send({Books: booksToReturn});
});

app.post('/books', cors(corsOptions), (req, res) => {
    const userId = req.cookies?.userId;
    if (!userId) {
        res.status(403).end();
        return;
    }

    const {book} = req.body;
    if (!book) {
        res.status(400).json({message: 'Book is missing'}).end();
        return;
    }

    const {title ,author, publicationYear ,description} = book;
    if (!(title && author && publicationYear && description)) {
        res.status(400).json({message: 'Bad request'}).end();
        return;
    }

    const newBook = {
        title ,author, publicationYear ,description, id: uuidv4()
    }
    Books.push(newBook);
    res.send({book: newBook}).status(200).end()
});

app.get('/books/:bookId', cors(corsOptions), (req, res) => {
    const userId = req.cookies?.userId;
    if (!userId) {
        res.status(403).end();
        return;
    }

    const {bookId} = req.params
    const book = Books.find((book) => book.id === bookId)
    if (!book) {
        res.status(400).json({message: 'Book not found'}).end();
        return;
    }

    res.send({book});
});

app.get('/reviews/:bookId', cors(corsOptions), (req, res) => {
    const userId = req.cookies?.userId;
    if (!userId) {
        res.status(403).end();
        return;
    }

    const {bookId} = req.params
    const book = Books.find((book) => book.id === bookId)
    if (!book) {
        res.status(400).json({message: 'Book not found'}).end();
        return;
    }

    res.send({book});
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});


// // Get all books
// app.get('/books', async (req, res) => {
//   try {
//     const booksSnapshot = await db.collection('books').get();
//     const books = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     res.json(books);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// // Add a new book
// app.post('/books', async (req, res) => {
//   try {
//     const newBook = req.body;
//     const docRef = await db.collection('books').add(newBook);
//     res.status(201).json({ id: docRef.id, ...newBook });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// // Update a book
// app.put('/books/:id', async (req, res) => {
//   try {
//     const updatedBook = req.body;
//     const bookId = req.params.id;
//     await db.collection('books').doc(bookId).update(updatedBook);
//     res.json({ id: bookId, ...updatedBook });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// // Delete a book
// app.delete('/books/:id', async (req, res) => {
//   try {
//     console.log(req.params)
//     const bookId = req.params.id;
//     await db.collection('books').doc(bookId).delete();
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });
