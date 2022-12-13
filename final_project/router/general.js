const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/customer/register", (req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    if(username && password){
        if(isValid(username)){
            let user = users.filter(user=>{
                return user===username;
            });
            user.password = password;
            users = users.filter(user =>{
                return user.username != username;
            });
            users.push(user); 
            res.send("User already exists, password changed"); 
        }
        else{
            users.push({"username":username, "password":password});
            res.send("User added successfully");
        }
    }
    else{
        res.send("Username or password not provided");
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let promise = new Promise ((resolve, reject)=>{
        let result = JSON.stringify(books);
        resolve(result);
    }) ;
    promise.then((books) =>{
        res.send(books);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let promise = new Promise((resolve, reject)=>{
        const book = books[req.params.isbn];
        if(book){
            resolve(JSON.stringify(book));
        }
        else{
            resolve( "ISBN not found");
        }
    });
    promise.then((book)=>{
        res.send(book);
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let promise = new Promise ((resolve, reject)=>{
        const author = req.params.author;
        let booksFromAuthor = [];
        Object.values(books).forEach(book =>{
            if(book.author===author){
                booksFromAuthor.push(book);
            }
        });
        if(booksFromAuthor.length > 0){
            
            resolve(JSON.stringify(booksFromAuthor));
        }
        else{
            resolve("No books from author");
        }
    });
    promise.then((book)=>{
        res.send(book);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let promise = new Promise((resolve, reject) => {
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
    promise.then((book)=>{
        res.send(book);
    });
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
