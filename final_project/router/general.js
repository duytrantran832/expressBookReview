const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Kiểm tra xem người dùng có nhập đủ user/pass không
  if (username && password) {
    // Kiểm tra xem tên đăng nhập đã tồn tại trong mảng users chưa
    let existingUser = users.filter((user) => user.username === username);
    
    if (existingUser.length === 0) {
      // Nếu chưa tồn tại, đẩy user mới vào mảng
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      // Nếu đã tồn tại
      return res.status(404).json({message: "User already exists!"});
    }
  }
  // Nếu thiếu user hoặc pass
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve) => {
    resolve(res.send(JSON.stringify({books}, null, 4)));
  });
  get_books.then(() => console.log("Function get books is called"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const get_book = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(res.status(200).json(books[isbn]));
    } else {
      reject(res.status(404).json({message: "No book found with this ISBN"}));
    }
  });
  get_book.then(() => console.log("Function get book is called"));
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const get_author = new Promise((resolve, reject) => {
    let matchingBooks = Object.values(books).filter(b => b.author === author);
    if (matchingBooks.length > 0) {
      resolve(res.status(200).json(matchingBooks));
    } else {
      reject(res.status(404).json({message: "No author found"}));
    }
  });
  get_author.then(() => console.log("Function get author is called"));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const get_title = new Promise((resolve, reject) => {
    let matchingBooks = Object.values(books).filter(b => b.title === title);
    if (matchingBooks.length > 0) {
      resolve(res.status(200).json(matchingBooks));
    } else {
      reject(res.status(404).json({message: "No title found"}));
    }
  });
  get_title.then(() => console.log("Function get title is called"));
});

module.exports.general = public_users;
