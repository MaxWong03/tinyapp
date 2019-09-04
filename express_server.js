const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');

//set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan('dev'));
app.use(cookieParser());

//taken from  //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5).toUpperCase();
};

const findUserByEmail = (userObj, userEmail) => {
  for (let user in userObj) {
    if (userObj[user].email === userEmail) return true;
  }
  return false;
};

const getUserByEmail = (userObj, userEmail) => {
  for (let user in userObj) {
    if (userObj[user].email === userEmail) return userObj[user];
  }
  return false;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.get('/', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render('urls_index', templateVars);
});

app.get('/register', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render('register', templateVars);
});

app.get('/login', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render('login', templateVars);
});

app.get('/urls/new', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render('urls_new', templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let user = getUserByEmail(users, email);
  if (!findUserByEmail(users, email)) res.status(403).end();
  else if (user.password !== password) res.status(403).end();
  else {
    const userID = generateRandomString();
    res.cookie('user_id', userID);
    res.redirect('urls');
  }
});

app.post('/logout', (req, res) => {
  console.log('deso it route logout');
  res.clearCookie('user_id');
  res.redirect('urls');
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  if (email === '') {
    res.status(400).end();
  } else if (findUserByEmail(users, email)) {
    res.status(400).end();
  } else {
    const password = req.body.password;
    const id = generateRandomString();
    users[id] = {id, email, password};
    res.cookie(`user_id`,id);
    res.redirect('/urls');
  }
});

app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

/**
 * Whatever you type in using the path /urls/yourURL will be dynamic
 * so req.params.shortURL will be whatever you type in, and it is a string
 * that allows you to take that string and search it into the urlDatabase object to access the long url that the shorturl is associated to
 */
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const userID = req.cookies['user_id'];
  let templateVars = { shortURL, longURL, user: users[userID] };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => { //redirecting to longURL
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls'); //redirect the client back to the url_index page
});

app.post('/urls/:shortURL', (req, res) => { //when user click edit in index page
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.post('/urls/:shortURL/edit', (req, res) => {//routing the edit action (when user edit longurl of a correspond shorturl via submit)
  const newURL = req.body.updateURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = newURL;
  res.redirect('/urls');
});





app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});