const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5).toUpperCase();
};

const getUserByEmail = (userObj, userEmail) => {
  for (let user in userObj) {
    if (userObj[user].email === userEmail) return userObj[user];
  }
  return false;
};

const urlsForUser = (id, urlDatabase) => {
  const userURL = {};
  for (let shortURL in urlDatabase) {
    const shortURLInfo = urlDatabase[shortURL];
    if (shortURLInfo.userID === id) userURL[shortURL] = shortURLInfo.longURL;
  }
  return userURL;
};

const isValidUser = (req, urlDatabase) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const shortURLOwner = urlDatabase[shortURL].userID;
  if (userID === shortURLOwner) return true;
  return false;
};

const invalidURL = (url, urlDatabase) => {
  for (let shortURL in urlDatabase) {
    if (url === shortURL) return false;
  }
  return true;
};

const renderHeader = (req, res, urlDB, userDB, version) => {
  const userID = req.session.user_id;
  const templateVars = { urls: urlDB, user: userDB[userID], req, res};
  res.render(`${version}`, templateVars);
};

const redirectFromHome = (req, res) => {
  const userID = req.session.user_id;
  if (userID) res.redirect('/urls');
  else res.redirect('/login');
};

const getCredential = (req) => {
  return { email: req.body.email, password: req.body.password };
};

const setCookieID = (req, res, id) => {
  // eslint-disable-next-line camelcase
  req.session.user_id = id;
  res.redirect('urls');
};

const logOutAndClean = (res) => {
  res.clearCookie('session');
  res.redirect('urls');
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
  isValidUser,
  invalidURL,
  renderHeader,
  redirectFromHome,
  getCredential,
  setCookieID,
  logOutAndClean
};