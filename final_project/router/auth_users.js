const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  // Kiểm tra xem user có tồn tại và đúng password không
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  
  return validusers.length > 0;
}

regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  // Sử dụng hàm authenticatedUser để kiểm tra
  if (authenticatedUser(username, password)) {
    // Tạo mã Access Token (JWT)
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Lưu Token và Username vào Session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("Đã nhận được yêu cầu Review cho ISBN:", req.params.isbn); //

  const isbn = req.params.isbn;
  let review = req.query.review;

  // PHẢI CÓ DÒNG NÀY: Kiểm tra xem đã đăng nhập chưa để tránh crash server
  if (!req.session || !req.session.authorization) {
    return res.status(403).json({message: "User not logged in"});
  }

  const username = req.session.authorization.username;

  if (books[isbn]) {
    let book = books[isbn];
    // Thêm hoặc cập nhật review
    book.reviews[username] = review;
    return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  } else {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
});
// Task 10: Xóa bài đánh giá sách
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
      let book = books[isbn];
      if (book.reviews[username]) {
          // Xóa review của chính user này
          delete book.reviews[username];
          return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`);
      } else {
          return res.status(404).send("Review not found for this user.");
      }
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
