require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json()); // in order to parse the req.body

// DB simulation
const posts = [
  {
    username: "name1",
    title: "I hope this postman thing is working"
  },
  {
    username: "name2",
    title: "Some lorem ipsum text here"
  },
  {
    username: "Marc",
    title: "Please work"
  }
];

// this is a middleware to control authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader)
  const token = authHeader && authHeader.split(" ")[1]; // we need to get rid of "Bearer "

  // if no token
  if (token === null) return res.sendStatus(401); // status unauthorized

  // verify that the token is correct
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(user)
    if (err) return res.sendStatus(403); // status access forbidden
    req.user = user; // store in the request.user the current user and move next
    next();
  })
  next()
}

app.get('/', (req, res) => {
  res.send('hello world')
})

// the auth part could be done with passport
app.get('/posts', authenticateToken, (req, res) => { // you will need to send the jwt in auth header in postman

  // get only the post belonging to that user
  res.send(posts.filter((post) => post.username === req.body.username))
})


app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = {
    username: username
  };
  console.log(user)
  // you just get a jwt for the user that is being logged in
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken })
})





app.listen(process.env.PORT, () => {
  console.log(`app listen on ${process.env.PORT}`);
})