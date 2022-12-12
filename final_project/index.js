const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const isValid = require('./router/auth_users.js').isValid;
users = require('./router/auth_users.js').users;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization) { //get the authorization object stored in the session
        token = req.session.authorization['accessToken']; //retrieve the token from authorization object
        jwt.verify(token, "access",(err,user)=>{ //Use JWT to verify token
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
});
 
const PORT =5000;

app.post("/customer/register", (req,res)=>{
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

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
