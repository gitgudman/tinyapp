const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

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
