const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5).toUpperCase();
};

const getUserByEmail = (userObj, userEmail) => {
  for (let user in userObj) {
    if (userObj[user].email === userEmail) return userObj[user];
  }
  return false;
};

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID"}
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

module.exports = {
  bodyParser,
  morgan,
  app,
  PORT,
  cookieParser,
  generateRandomString,
  getUserByEmail,
  urlDatabase,
  users
};