const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

users = [{"username":"tester",
                "password":"pwd"}];

const isValid = (username)=>{ //returns boolean
    let users_with_username = users.filter(user => {
        return user.username === username;
    });
    if(users_with_username.length>0){
        return true;
    }
    else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const auth_users = users.filter((user) =>{
        return (user.username === username)&&(user.password===password);
    });
    if(auth_users.length > 0){
        return true;
    }
    else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } 
    else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];
    const username = req.session.authorization["username"];
    if(book){
        if(Object.keys(book.reviews).length===0){
            book.reviews = {0:{"username":username, "review":req.query.review}};
            res.send("First review added");
        }
        else{
            let flag = false;
            Object.values(book.reviews).forEach(review =>{
                if(review.username === username){
                    review.review = req.query.review;
                    flag = true;
                    res.send("Review changed");
                }
            });
            if(!flag){
                book.reviews[Object.keys(book.reviews).length] = {"username":username, "review":req.query.review};
                res.send("New Review added");
            }
        }  
    }
    else{
        res.send( "ISBN not found");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) =>{
    let book = books[req.params.isbn];
    const username = req.session.authorization.username;
    if(book){
        if(Object.keys(book.reviews).length===0){
            res.send("Nothing to remove");
        }
        else{
            let flag = false;
            Object.keys(book.reviews).forEach(key =>{
                if(book.reviews[key].username === username){
                    delete book.reviews[key];
                    flag = true;
                    res.send("Review removed");
                }
            });
            if(!flag){
                res.send("Nothing to remove");
            }
        }  
    }
    else{
        res.send("ISBN not found");
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
