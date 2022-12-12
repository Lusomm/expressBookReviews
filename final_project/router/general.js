const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const book = books[req.params.isbn];
    if(book){
        res.send(JSON.stringify(book));
    }
    else{
        res.send( "ISBN not found");
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksFromAuthor = [];
    Object.values(books).forEach(book =>{
        if(book.author===author){
            booksFromAuthor.push(book);
        }
    });
    if(booksFromAuthor.length > 0){
        res.send(JSON.stringify(booksFromAuthor));
    }
    else{
        res.send("No books from author");
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksWithTitle = [];
    Object.values(books).forEach(book =>{
        if(book.title===title){
            booksWithTitle.push(book);
        }
    });
    if(booksWithTitle.length > 0){
        res.send(JSON.stringify(booksWithTitle));
    }
    else{
        res.send("No books with this title");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book = books[req.params.isbn];
    if(book){
        res.send(JSON.stringify(book.reviews));
    }
    else{
        res.send( "ISBN not found");
    }
});

module.exports.general = public_users;
