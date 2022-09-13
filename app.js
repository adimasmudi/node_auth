const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");

// json data
const userData = require("./json/user.json");

const app = express();

var session;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// // parse application/json
app.use(bodyParser.urlencoded({ extended: true }));

const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// cookie parser middleware
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/welcome", (req, res) => {
  const { username, password } = req.body;

  for (user of userData) {
    if (username === user.username && password === user.password) {
      session = req.session;
      session.user = user.username;
      return res.redirect(`/${user.role}`);
    }
  }

  return res.send(`username atau password tidak ada di sistem`);
});

app.get("/admin", (req, res) => {
  for (user of userData) {
    if (req.session.user === user.username && user.role === "admin") {
      console.log(req.session.user);
      return res.render("admin");
    }
  }

  return res.send("Anda tidak punya akses sebagai admin");
});

app.get("/student", (req, res) => {
  for (user of userData) {
    if (req.session.user === user.username && user.role === "student") {
      console.log(req.session.user);
      return res.render("student");
    }
  }

  return res.send("Anda tidak punya akses sebagai siswa student");
});

app.get("/teacher", (req, res) => {
  for (user of userData) {
    if (req.session.user === user.username && user.role === "teacher") {
      console.log(req.session.user);
      return res.render("teacher");
    }
  }
  return res.send("Anda tidak mendapatkan akses guru");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("listening on port 5000");
});
