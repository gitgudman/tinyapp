const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // allows express to parse form POST request


// eslint-disable-next-line func-style
function generateRandomString() {
  // Generates a random 6-character alphanumeric string
  return Math.random().toString(36).substring(2, 8);
}


const urlDatabase = {
  b2xVn2: { longURL: "http://www.lighthouselabs.ca" },
  "9sm5xK": { longURL: "http://www.google.com" }
};
  
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); // generate a short URL id
  urlDatabase[shortURL] = { longURL: req.body.longURL }; // save longURL to database
  res.redirect(`/urls/${shortURL}`); // redirect to the new URL show page
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id; // Get the short URL id from the route
  delete urlDatabase[id]; // Remove the URL from the database
  res.redirect("/urls");
});

app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  const newLongURL = req.body.longURL;

  urlDatabase[shortURL].longURL = newLongURL;
  res.redirect('/urls');
});



app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }; // Pass the urlDatabase object
  res.render("urls_index", templateVars);     // Render the index with URLs
});
// Place this above or below your existing routes, order does not matter for GETs


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});




// app.get('/u/:id', (req, res) => {
//   const shortURL = req.params.id; // The short URL code
//   const entry = urlDatabase[shortURL]; // Lookup in the database
//   if (!entry) {
//     return res.status(404).send('Short URL not found');
//   }
//   res.redirect(entry.longURL); // Redirect if found
// });

app.get('/urls/:id', (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL
  };
  res.render("urls_show", templateVars);
});
    
  

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  // prepares the data object for the template
  res.render("urls_index", templateVars);
  // renders the urls_index.ejs view, passing in the data
});
  
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// // express_server.js
// const express = require('express');
// const app = express();
// const PORT = 8080;

// const bodyParser = require('body-parser');
// const cookieSession = require('cookie-session');

// app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({ extended: true}));
// app.use(cookieSession({
//   name: 'session',
//   keys: ['secret-key'],
// }));

// const urlDatabase = {};
// const users = {};

// // Home Route
// app.get('/', (req, res) => {
//   const userId = req.session.user_id;
//   if (userId) {
//     return res.redirect('/urls');
//   }
//   return res.redirect('login');
// });

// app.listen(PORT, () => {
//   console.log('TinyApp is listening on port ${PORT}');
// });
