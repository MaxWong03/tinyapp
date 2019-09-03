const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');


//set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


//taken from  //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5).toUpperCase();
};





const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
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
  let templateVars = { shortURL, longURL };
  res.render('urls_show', templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls'); //redirect the client back to the url_index page
});

app.post('/urls/:shortURL', (req,res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.post('/urls/:shortURL/edit', (req, res) => {
  const newURL = req.body.updateURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = newURL;
  res.redirect('/urls');
});


app.get('/u/:shortURL', (req, res) => { //redirecting to longURL
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});