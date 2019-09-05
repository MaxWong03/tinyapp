const { bodyParser, app, PORT, urlDatabase, users, bcrypt, cookieSession} = require('./constants');
const {generateRandomString, getUserByEmail, urlsForUser, isValidUser, invalidURL, renderHeader} = require('./helperFunctions');
//server engine set up
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.get('/', (req, res) => {
  const userID = req.session.user_id;
  if (userID) res.redirect('/urls');
  else res.redirect('/login');
});

app.get('/invalid_delete', (req, res) => renderHeader(req, res, urlDatabase, users, 'invalid_delete'));

app.get('/invalid_edit', (req, res) => renderHeader(req, res, urlDatabase, users, 'invalid_edit'));

app.get('/urls', (req, res) => renderHeader(req, res, urlsForUser(req.session.user_id, urlDatabase), users, 'urls_index'));

app.get('/login', (req, res) => renderHeader(req, res, urlDatabase, users, 'login'));

app.get('/login_fail', (req, res) => renderHeader(req, res, urlDatabase, users, 'login_fail'));

app.get('/register', (req, res) => renderHeader(req, res, urlDatabase, users, 'register'));

app.get('/reg_fail', (req, res) => renderHeader(req, res, urlDatabase, users, 'reg_fail'));

app.get('/urls/new', (req, res) => {
  const userID = req.session.user_id;
  if (!users[userID]) res.redirect('/login');
  else renderHeader(req, res, urlDatabase, users, 'urls_new');
});

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (invalidURL(shortURL, urlDatabase)) renderHeader(req, res, urlDatabase, users, 'invalid_short_url');
  else if (!isValidUser(req, urlDatabase)) renderHeader(req, res, urlDatabase, users, 'invalid_edit');
  else renderHeader(req, res, urlDatabase, users, 'urls_show');
});

app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (invalidURL(shortURL, urlDatabase)) renderHeader(req, res, urlDatabase, users, 'invalid_short_url');
  else {
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  }
});

app.post('/urls', (req, res) => {
  const userID = req.session.user_id;
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {longURL, userID};
  res.redirect(`/urls/${shortURL}`);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let user = getUserByEmail(users, email);
  if (!user) res.status(403).redirect('/login_fail');
  else if (!bcrypt.compareSync(password,user.password)) res.status(403).redirect('/login_fail');
  else {
    // eslint-disable-next-line camelcase
    req.session.user_id = user.id;
    res.redirect('urls');
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('session');
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
    // eslint-disable-next-line camelcase
    req.session.user_id = id;
    res.redirect('/urls');
  }
});

app.post('/urls/:shortURL/delete', (req, res) => {
  if (isValidUser(req,urlDatabase)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else res.redirect('/invalid_delete');
});

app.post('/urls/:shortURL', (req, res) => {
  if (isValidUser(req, urlDatabase)) {
    const newURL = req.body.updateURL;
    const shortURL = req.params.shortURL;
    urlDatabase[shortURL].longURL = newURL;
    res.redirect('/urls');
  } else res.redirect('/invalid_edit');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});