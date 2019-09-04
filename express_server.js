const {bodyParser, morgan, app, PORT, cookieParser, generateRandomString, getUserByEmail, urlDatabase, users}
= require('./constants');


//server engine set up
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan('dev'));
app.use(cookieParser());


//GET Requests Routes
app.get('/urls', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render('urls_index', templateVars);
});

app.get('/login', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render('login', templateVars);
});

app.get('/login_fail', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render('login_fail', templateVars);
});

app.get('/register', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render('register', templateVars);
});

app.get('/reg_fail', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render('reg_fail', templateVars);
});

app.get('/urls/new', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render('urls_new', templateVars);
});

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


//POST requests routes
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let user = getUserByEmail(users, email);
  if (!user) res.status(403).redirect('/login_fail');
  else if (user.password !== password) res.status(403).redirect('/login_fail');
  else {
    res.cookie('user_id', user.id);
    res.redirect('urls');
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('urls');
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  if (email === '') {
    res.status(400).redirect('/reg_fail');
  } else if (getUserByEmail(users, email)) {
    res.status(400).redirect('/reg_fail');
  } else {
    const password = req.body.password;
    const id = generateRandomString();
    users[id] = {id, email, password};
    res.cookie(`user_id`,id);
    res.redirect('/urls');
  }
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls'); //redirect the client back to the url_index page
});

app.post('/urls/:shortURL/edit', (req, res) => {//routing the edit action (when user edit longurl of a correspond shorturl via submit)
  const newURL = req.body.updateURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = newURL;
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => { //when user click edit in index page
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});