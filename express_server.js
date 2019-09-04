const {bodyParser, morgan, app, PORT, cookieParser, generateRandomString, getUserByEmail, urlDatabase, users}
= require('./constants');


/**
 * 3)
 * Return an object with key being shortURL
 * The value of key is one that the userID matches with the input id
 * just a regular object, instead of obj within an obj like the new url database
 * 
 * @param {String} id //the cookie of the logged in user
 * @return {Object} urls 
 * urls = {
 *  shortURL: longURL *probably have to filter out the userID key value pair
 * }
 * 
 * Note:
 * 1) Use in urls_index
 * 2) Simple unit test shows this function returns the correct urlsForUser
 * 3) Could possibly refactor in constants and export out
 */
const urlsForUser = (id, urlDatabase) => {
  const userURL = {};
  for (let shortURL in urlDatabase) {
    const shortURLInfo = urlDatabase[shortURL];
    if (shortURLInfo.userID === id) userURL[shortURL] = shortURLInfo.longURL;
  }
  return userURL;
};

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


/**
 * 
 * This is what i was working at
 * What im trying to accompliush is that if the user access a url/:id http://localhost:8080/urls/ngpYKL
 * when they are not logged in yet, tell them to log in (probably use cookie)
 * and if they are logged in but trying to access a key that doesnt belong to them, tell them to f off
 * 
 */
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
  const userID = req.cookies['user_id'];
  const shortURL = req.params.shortURL;
  const shortURLOwner = urlDatabase[shortURL].userID;
  if (userID === shortURLOwner) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls'); //redirect the client back to the url_index page
  } else res.redirect('/invalid_delete');
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