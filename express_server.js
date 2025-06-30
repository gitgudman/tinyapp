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
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


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
