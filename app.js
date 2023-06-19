const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const https = require("https");





const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
var port = process.env.PORT || 3000;




// Serve static files from the "views" directory
app.use(express.static('views'));

// Handle sign-up form submission
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  newUser.save()
    .then(() => {
      res.redirect('/login');
    })
    .catch(error => {
      console.error('Error saving user:', error);
      res.sendStatus(500);
    });
})


// Define routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html')
});

//Render Index page
app.post('/index', (req, res) => {
  res.render('index')
})


///Get username and roomname from form and pass it to room
app.post('/room', (req, res) => {
  roomname = req.body.roomname;
  username = req.body.username;
  res.redirect(`/room?username=${username}&roomname=${roomname}`)
})

//Rooms
app.get('/room', (req, res)=>{
  res.render('room')
})
//Start Server
const server = app.listen(port, () => {
    console.log(`Server Running on ${port}`)
})

const io = socket(server);
require('./utils/socket')(io);