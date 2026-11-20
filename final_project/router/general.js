const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');

const public_users = express.Router();

// Internal endpoint: provides the local book database
public_users.get('/books', function (req, res) {
  return res.status(200).json(books);
});

// Retrieve books through Axios
async function fetchBooks() {
  const response = await axios.get('http://localhost:5000/books');
  return response.data;
}

// Get all books
public_users.get('/', async function (req, res) {
  try {
    const data = await fetchBooks();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const data = await fetchBooks();
    const book = data[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get books by author
public_users.get('/author/:author', async function (req, res) {
  try {
    const data = await fetchBooks();
    const author = req.params.author.toLowerCase();

    const results = Object.fromEntries(
      Object.entries(data).filter(([isbn, book]) =>
        book.author && book.author.toLowerCase() === author
      )
    );

    if (Object.keys(results).length === 0) {
      return res.status(404).json({ message: 'No books found for this author' });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get books by title
public_users.get('/title/:title', async function (req, res) {
  try {
    const data = await fetchBooks();
    const title = req.params.title.toLowerCase();

    const results = Object.fromEntries(
      Object.entries(data).filter(([isbn, book]) =>
        book.title && book.title.toLowerCase() === title
      )
    );

    if (Object.keys(results).length === 0) {
      return res.status(404).json({ message: 'No books found with this title' });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports.general = public_users;
