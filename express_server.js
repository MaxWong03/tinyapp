const { bodyParser, app, PORT, urlDatabase, users, bcrypt, cookieSession, methodOverride } = require('./constants');
const { generateRandomString, getUserByEmail, urlsForUser, isValidUser, invalidURL, renderHeader, redirectFromHome, getCredential, setCookieID, logOutAndClean, isLogIn, countTotalVis } = require('./helperFunctions');
/**
 * SERVER ENGINE SET UP
 */
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));
app.use(methodOverride('_method'));
app.use('/u/:shortURL', countTotalVis(urlDatabase, users));
/**
 * ALL GET REQUEST ROUTES
 */

app.get('/', (req, res) => redirectFromHome(req, res));

app.get('/invalid_delete', (req, res) => renderHeader(req, res, urlDatabase, users, 'invalid_delete'));

app.get('/invalid_edit', (req, res) => renderHeader(req, res, urlDatabase, users, 'invalid_edit'));

app.get('/urls', (req, res) => renderHeader(req, res, urlsForUser(req.session.user_id, urlDatabase), users, 'urls_index'));

app.get('/login', (req, res) => {//this is what im fixing
  if (!isLogIn(req)) renderHeader(req, res, urlDatabase, users, 'login');
  else res.redirect('/urls');
});

app.get('/login_fail', (req, res) => renderHeader(req, res, urlDatabase, users, 'login_fail'));

app.get('/register', (req, res) => {
  if (!isLogIn(req)) renderHeader(req, res, urlDatabase, users, 'register');
  else res.redirect('/urls');
});

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

/**
 * ALL POST REQUEST ROUTES
 */

app.post('/urls', (req, res) => {
  const userID = req.session.user_id;
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID, totalVis: 0 }; //<< this is where im working at 
  res.redirect(`/urls/${shortURL}`);
});

app.post('/login', (req, res) => {
  const { email, password } = getCredential(req);
  let user = getUserByEmail(users, email);
  if (!user) res.status(403).redirect('/login_fail');
  else if (!bcrypt.compareSync(password, user.hashPassword)) res.status(403).redirect('/login_fail');
  else setCookieID(req, res, user.id);
});

app.post('/logout', (req, res) => logOutAndClean(req, res));

app.post('/register', (req, res) => {
  const { email, password } = getCredential(req);
  if (email === '') res.status(400).redirect('/reg_fail');
  else if (getUserByEmail(users, email)) res.status(400).redirect('/reg_fail');
  else {
    const hashPassword = bcrypt.hashSync(password, 10);
    const id = generateRandomString();
    users[id] = { id, email, hashPassword };
    setCookieID(req, res, id);
  }
});

app.delete('/urls/:shortURL', (req, res) => {
  if (isValidUser(req, urlDatabase)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else res.redirect('/invalid_delete');
});

app.put('/urls/:shortURL', (req, res) => {
  if (isValidUser(req, urlDatabase)) {
    const newURL = req.body.updateURL;
    const shortURL = req.params.shortURL;
    urlDatabase[shortURL].longURL = newURL;
    res.redirect('/urls');
  } else renderHeader(req, res, urlDatabase, users, 'urls_show');
});

/**
 * LISTEN TO PORT 8080
 */
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});