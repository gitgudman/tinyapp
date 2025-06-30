/* eslint-disable camelcase */
const express = require("express");
const app = express();
const PORT = 8080;

const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["ligthouse-secret-key"],
  })
);

// eslint-disable-next-line func-style
function generateRandomString() {
  // Generates a random 6-character alphanumeric string
  return Math.random().toString(36).substring(2, 8);
}

// Databases
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "potato" },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "guest" },
};

const users = {
  potato: {
    id: "potato",
    email: "potato@apple.com",
    password: bcrypt.hashSync("bigpotato", 10),
  },
  guest: {
    id: "guest",
    email: "guest@apple.com",
    password: bcrypt.hashSync("tinyguest", 10),
  },
};

const getUserByEmail = (email, users) => {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

const urlsForUser = function(id) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

// Routes
app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  if (users[userId]) {
    return res.redirect("/urls");
  }
  res.render("login");
});

app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  if (users[userId]) {
    return res.redirect("/urls");
  }
  res.render("register");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password cannot be empty.");
  }
  const existingUser = getUserByEmail(email, users);
  if (existingUser) {
    return res.status(400).send("Email already exists.");
  }
  const id = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id, email, password: hashedPassword };
  users[id] = newUser;
  req.session.user_id = id;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);
  if (!user) {
    return res.status(403).send("No user with that email found.");
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Incorrect password.");
  }
  req.session.user_id = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/urls", (req, res) => {
  const userId = req.session.user_id;
  if (!users[userId]) {
    return res.status(401).send("You must be logged in to shorten URLs.");
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: userId,
  };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.user_id;
  const id = req.params.id;
  const url = urlDatabase[id];
  if (!url) {
    return res.status(404).send("URL does not exist.");
  }
  if (!userId || url.userID !== userId) {
    return res.status(403).send("Not authorized to delete this URL.");
  }
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const id = req.params.id;
  const url = urlDatabase[id];
  if (!url) {
    return res.status(404).send("URL does not exist.");
  }
  if (!userId || url.userID !== userId) {
    return res.status(403).send("Not authorized to edit this URL.");
  }
  urlDatabase[id].longURL = req.body.longURL;
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if (!user) {
    return res.status(401).send("Please log in or register to view URLs.");
  }
  const templateVars = {
    urls: urlsForUser(userId),
    user,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if (!user) {
    return res.redirect("/login");
  }
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const url = urlDatabase[req.params.id];
  if (!user) {
    return res.status(401).send("Please log in to view this URL.");
  }
  if (!url) {
    return res.status(404).send("URL does not exist.");
  }
  if (url.userID !== userId) {
    return res.status(403).send("Not authorized to view this URL.");
  }
  const templateVars = {
    id: req.params.id,
    longURL: url.longURL,
    user,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const entry = urlDatabase[id];
  if (!entry) {
    return res.status(404).send("Short URL not found.");
  }
  res.redirect(entry.longURL);
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