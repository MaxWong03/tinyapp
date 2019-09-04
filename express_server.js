const {bodyParser, morgan, app, PORT, cookieParser, generateRandomString, getUserByEmail, urlDatabase, users, bcrypt, urlsForUser, isValidUser}
= require('./constants');

//server engine set up
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan('dev'));
app.use(cookieParser());

app.get('/invalid_delete', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render('invalid_delete', templateVars);
});

app.get('/invalid_edit', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlDatabase, user: users[userID] };
  res.render('invalid_edit', templateVars);
});

app.get('/urls', (req, res) => {
  const userID = req.cookies['user_id'];
  let templateVars = { urls: urlsForUser(userID, urlDatabase), user: users[userID]};
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
  if (!users[userID]) res.redirect('/login');
  else res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const userID = req.cookies['user_id'];
  let templateVars = { shortURL, longURL, user: users[userID] ,urlDatabase};
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => { //redirecting to longURL
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});


//POST requests routes
app.post('/urls', (req, res) => {
  const userID = req.cookies['user_id']; //2)
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {longURL, userID}; //2)
  res.redirect(`/urls/${shortURL}`);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let user = getUserByEmail(users, email);
  console.log('typed:', password);
  console.log('hash:', user.password);
  if (!user) res.status(403).redirect('/login_fail');
  else if (!bcrypt.compareSync(password,user.password)) res.status(403).redirect('/login_fail');
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
    const password = bcrypt.hashSync(req.body.password, 10);
    const id = generateRandomString();
    users[id] = {id, email, password};
    console.log(users);
    res.cookie(`user_id`,id);
    res.redirect('/urls');
  }
});

app.post('/urls/:shortURL/delete', (req, res) => {
  if (isValidUser(req,urlDatabase)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls'); //redirect the client back to the url_index page
  } else res.redirect('/invalid_delete');
});

app.post('/urls/:shortURL/edit', (req, res) => {//routing the edit action (when user edit longurl of a correspond shorturl via submit)
  if (isValidUser(req, urlDatabase)) {
    const newURL = req.body.updateURL;
    const shortURL = req.params.shortURL;
    urlDatabase[shortURL].longURL = newURL;
    res.redirect('/urls');
  } else res.redirect('/invalid_edit');
});

app.post('/urls/:shortURL', (req, res) => { //when user click edit in index page
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});