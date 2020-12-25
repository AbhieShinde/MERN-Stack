const express = require('express');
const app = express();
const port = 8000;

// app.get('/', (req, res) => res.send('Hello World!'));
// OR
app.get('/', (req, res) => {
    return res.send('Hello World!');
});
// when we're using curly braces we've to use 'return' statement

app.get('/signup', (req, res) => {
    return res.send('Signing Up...');
});

app.get('/signout', (req, res) => res.send('You\'re signed out!'));

// naming the function and then using it
const admin = (req, res) => res.send('This is Admin');

//middleware
const isAdmin = (req, res, next) => {
    console.log('Admin middleware is running');
    next(); // this will give call to next execution in route defination
}

const isLoggedIn = (req, res, next) => {
    console.log('SignedIn auth middleware is running');
    next();
}

// adding middlewares and then responce
app.get('/admin', isLoggedIn, isAdmin, admin);

app.listen(port, () => console.log(`Server is running and listening at http://localhost:${port}`));