const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

// Get all books
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    const book = response.data[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book" });
  }
});

// Get books by author
public_users.get('/author/:author', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    const author = decodeURIComponent(req.params.author).toLowerCase();

    const result = Object.fromEntries(
      Object.entries(response.data).filter(([isbn, book]) =>
        book.author && book.author.toLowerCase() === author
      )
    );

    if (Object.keys(result).length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get books by title
public_users.get('/title/:title', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    const title = decodeURIComponent(req.params.title).toLowerCase();

    const result = Object.fromEntries(
      Object.entries(response.data).filter(([isbn, book]) =>
        book.title && book.title.toLowerCase() === title
      )
    );

    if (Object.keys(result).length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
