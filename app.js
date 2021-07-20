// `path` is a core node.js module
const path = require("path");

// required for creating express server
const express = require("express");

const mongoose = require("mongoose");

// required for setting up config
const dotenv = require("dotenv");

// setting up `morgan` for login
// required for when there's a request to a page or any kind of request at all that it just shows down the console
const morgan = require("morgan");

// required for setting up our template engine
const exphbs = require("express-handlebars");

// middleware required for PUT
const methodOverride = require("method-override");

// required for setting up authentication strategy
const passport = require("passport");

// required for setting up sessions
const session = require("express-session");

// We are passing `session`, which is `express-session` right above as a parameter
const MongoStore = require("connect-mongo");

// bring in `connectDB` from the config directory
const connectDB = require("./config/db");

// Load config
// we pass in an object with `path` as the key and path to the config file as its value
dotenv.config({ path: "./config/config.env" });

// Passport config
// We're passing in the imported `passport` as a parameter to `passport.js`
require("./config/passport")(passport);

connectDB();

// initialize app
const app = express();

// Body parser
// Middleware to be used for POST API for adding a new story
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Logging
// To only run `morgan` in dev mode
if (process.env.NODE_ENV === "development") {
  // adding the `morgan` middleware
  // different arguments can be passed for different levels of login. Here, we've used 'dev'
  app.use(morgan("dev"));
}

// Handlebar Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// Handlebars
// Adding the `express-handlebars` middleware
// In case of Template Engines, we have a layout that wraps around everything. That layout hs like the HTML head and body tags and stuff that you don't want to repeat in different views and it basically jsut wraps around those views
// The `helpers` key will contain all the helper methods that our template will need
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Static folder
// `__dirname` means current directory
// `public` is our static directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

// Whenever we use `process.env`, we can use variables that are in that config
// If the config file is missing this parameter, it'll use 5000 as the PORT as given in the code below
const PORT = process.env.PORT || 3000;

// to run the server with appropriate message
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
