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
    if (shortURLInfo.userID === id) userURL[shortURL] = {longURL: shortURLInfo.longURL, totalVis: shortURLInfo.totalVis, uniqueVis: shortURLInfo.uniqueVis};
  }
  return userURL;
};

const isLogIn = (req) => req.session.user_id ? true : false;

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
  const templateVars = { urls: urlDB, user: userDB[userID], req, res };
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

const logOutAndClean = (req, res) => {
  req.session = null;
  res.redirect('urls');
};


const countTotalVis = (urlDatabase, users) => {
  const middleWare = (req, res, next) => {
    if (invalidURL(req.params.shortURL, urlDatabase)) {
      renderHeader(req, res, urlDatabase, users, 'invalid_short_url');
      next();
    } else {
      const unqiueVisArr = urlDatabase[req.params.shortURL].uniqueVis;
      const userID = req.session.user_id;
      urlDatabase[req.params.shortURL].totalVis++;
      urlDatabase[req.params.shortURL].stamps.push({timeStamp: new Date().toUTCString(), userID: !userID ? 'Non TinyApp User' : userID});
      if (!unqiueVisArr.length) unqiueVisArr.push(userID);
      else {
        if (unqiueVisArr.indexOf(userID) === -1) unqiueVisArr.push(userID);
      }
      res.redirect(urlDatabase[req.params.shortURL].longURL);
      next();
    }
  };
  return middleWare;
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
  logOutAndClean,
  isLogIn,
  countTotalVis
};