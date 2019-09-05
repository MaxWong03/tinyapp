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

//Good to go for refactor
const isValidUser = (req, urlDatabase) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const shortURLOwner = urlDatabase[shortURL].userID;
  if (userID === shortURLOwner) return true;
  return false;
};

const invalidShortURL = (url, urlDatabase) => {
  for (let shortURL in urlDatabase) {
    if (url === shortURL) return true;
  }
  return false;
};
module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
  isValidUser,
  invalidShortURL
};