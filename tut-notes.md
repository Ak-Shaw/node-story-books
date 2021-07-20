YouTube: [https://www.youtube.com/watch?v=SBvmnHTQIPY&list=RDCMUC29ju8bIPH5as8OGnQzwJyA&index=2](https://www.youtube.com/watch?v=SBvmnHTQIPY&list=RDCMUC29ju8bIPH5as8OGnQzwJyA&index=2)

### Initial Setup 1

```bash
# setup package.json
npm init

# dependencies
npm i express mongoose connect-mongo express-session express-handlebars dotenv method-override moment passport passport-google-oauth20 morgan

# dev dependencies
npm i -D nodemon cross-env
```

---

### Initial Setup 2

In `package.json`, the `scripts` section should look like the following:

```js
"scripts": {
    "start": "cross-env NODE_ENV=production node app",
    "dev": "cross-env NODE_ENV=development nodemon app"
  },
```

- `start`:

  - `cross-env`: so that we can set environment variables
  - `NODE_ENV=production`: to explicitly set the node environment to production
  - `node app`: to start the app using `app.js`

- `dev`:

  - `cross-env`: so that we can set environment variables
  - `NODE_ENV=development`: to explicitly set the node environment to development
  - `nodemon app`: to start the app using `app.js`

---

### Initial Setup 3

- Create `app.js`
  - Import `express` and `dotenv`
  - Load the config file
  - Initialize the application using `express()`
- Create `./config/config.env` and add `PORT` and `MONGO_URI` parameters with their respective values.
- Coming back to `app.js`
  - Extract the `PORT` from the config file
  - Give a default `PORT` value if the same is absent from the config file
  - Add the statement to run the server using `listen()` with an appropriate message.

You should be able to run the server using `npm run dev` in development mode. Replace `dev` with `start` to run the same in production mode.

---

### Initial Setup 4

Time to connect to the DB

- Create `./config/db.js`.
- Import `mongoose`
- Create an **async** function `connectDB` with the required statements.
- Log the host on successful DB connection
- Export `connectDB`

---

### Initial Setup 5

Time to setup `morgan`

- In `app.js`:
  - Import `morgan`
  - Add the `morgan` middleware on `dev` level of login if the `NODE_ENV` is in dev mode.

---

### Initial Setup 6

Time to setup our template engine

- In `app.js`:
  - Import `express-handlebars`
  - Add the `express-handlebars` middleware
- Create `./views/layouts/main.hbs` and also create a `login.hbs` in the same directory
  - In `main.hbs` add some _boiler plate HTML_.
    - Add stylesheet for **materialize** using _CDN_
    - Add stylesheet for **font-awesome** using _CDN_
    - Add script for **materialize** using _CDN_
    - Add static stylesheet from root.
    - Add the following as child to the body:
      ```hbs
      <div class="container">
        {{{body}}}
      </div>
      ```
    - In `login.hbs`, copy-paste the contents of `main.hbs` and add the following content as child to the body:
      ```hbs
      <div class="container login-container">
        <div class="card">
          <div class="card-content">
            {{{body}}}
          </div>
        </div>
      </div>
      ```
- Create `./routes/index.js`. This will serve as the homepage (basically the top level).
- Create the necessary files with the required content in the `./views/` directory
- Create `./public/css/style.css` and load the same as static file in `app.js` and also add the routes in `app.js`

---

### Initial Setup 7

**GCP**

- Create new project
- Go to **API & Services** form the **Navigation Menu**
- _ENABLE APIS AND SERVICES_
  - Google+ API
    - Go to _Manage -> Credentials_ Section
    - Create _Credentials_ - **OAuth client ID**
      > [NOTE: **OAuth consent** is required before configuring the **OAuth client ID**.]
    - Add the **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET** to `./config/config.env`

---

### Initial Setup 8

**Passport.js**

> [NOTE: Used for authentication. It's an authentication package and there's just tons of strategies used for authentication.]

- Go to [passportjs.org](http://www.passportjs.org).
- Search for `passport-google-oauth20`.
- We'll get the instructions needed to follow to utilize it in our project.
- Create `./config/passport.js`. This file will contain the strategy to be followed for the method of authentication we'll be utilizing, Google OAuth 2.0 in this case.
- In `app.js`:

  - Import `passport`
  - Load `./config/passport.js`
  - Add passport middleware
  - Import `express-session`
  - Add session middleware as follows:

    ```js
    app.use(
      session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
      })
    );
    ```

    - `secret`: Use whatever you want
    - `resave`: Boolean as to whether we want to save a session if nothing is modified
    - `saveUninitialized`: Boolean as to whether to create a session until something is stored
    - `cookie`: This won't work without **HTTPS**, so removed from the block

- In `passport.js`:
  ```js
  const GoogleStrategy = require("passport-google-oauth20").Strategy;
  const mongoose = require("mongoose");
  ```
- Create `./models/User.js`
  - Import `mongoose`
  - Create `UserSchema`
  - Export the same
- In `passport.js`:
  - Import `User` model
  - Add required function as `module.exports`
- Create `./routes/auth.js`
  - Add the necessary routes for `/auth/google` and `auth/google/callback`
- In `app.js`:
  - Add the route to be used for auth, `/auth` in this case.
- In `passport.js`:
  - Add the callback for creating a user and storing the details in the database.

---

### Misc 1 (ensureAuth and ensureGuest)

- Add route for `logout` in `auth.js`
- Create `./views/partials/_header.hbs` (preceding with `_` is the convention for naming partials, which will be inserted into another view)
  - Add the necessary content for the nav bar
- In `main.hbs`
  - Add `{{>_header}}` right below the body tag (this is how we insert a partial)
  - Add **Materialize** script for initializing the _Sidenav_ (referring to the nav bar which we added in the `_header.hbs`)
- Create `./middleware/auth.js`
  - This middleware will ensure that specific routes are being accessed by only logged in users and redirects to login page happens if a user tries to access pages like dashboard without a login
- In `./routes/index.js`:
  - Add `const { ensureAuth, ensureGuest } = require('../middleware/auth')`
  - Add the middleware as another argument to the routes in `index.js`

---

### Misc 2 (Setting up session)

- In `app.js`
  - Add `const MongoStore = require('connect-mongo')` right below `const session = require("express-session");`
  - Make the following changes in `app.js`:
    ```js
    // Sessions
    app.use(
      session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
      })
    );
    ```

---

### Misc 3

- Create `./models/Story.js`
- Add the functionality to load stories posted by a user on their dashboard by making necessary changes in `./routes/index.js`

---

### Misc 4

- Create `404.hbs` and `500.hbs` under `./views/error/`
- In `index.js`, render `500.hbs` on encountering an error in case of `/dashboard` endpoint
- Add code in `dashboard.hbs` to render the stories in a tabular format
- Create a partial named `_add_btn.hbs`
- Add the partial in the main layout by adding `{{>_add_btn}}` right below `{{>_header}}`
- Create `./views/stories/add.hbs`
  - Add a form for creating a story
- Create `./routes/stories.js`
  - Add the necessary router for adding a story
  - Add the route to `app.js`
  - Initialize Materialize for the form by adding the below code in the main layout:
    ```js
    M.FormSelect.init(document.querySelector("#status"));
    ```
  - Add cdn for **ckeditor** in main layout
    - Activate it with the necessary plugins
- Add a middleware in `app.js` file for POST API for adding a new story
- Implement POST API for creating a story in `stories.js`

---

### Misc 5

Formatting the Date being displayed in the stories table of the dashboard:

- Create `./helpers/hbs.js`
  - Import `moment`
  - Implement the function to format a date with a given format
  - In order to use it in our template, we need to register it with handlebars
- In `app.js`:
  - Add:
    ```js
    const { formatDate } = require("./helpers/hbs");
    ```
  - Add the `formatDate` helper in the Handlebars
- In `dashboard.hbs`:
  - Modify the cell for date as follows:
  ```js
  {{formatDate createdAt 'MMMM Do YYYY, h:mm:ss a'}}
  ```
  **[NOTE:** Here, `formatDate` is the method and the next two tokens are the parameters, respectively, the date and the format.**]**

---

### Misc 6

Time to create a view for stories:

- Create `./views/stories/index.hbs`
  - Add necessary code for rendering all stories
- Add a GET route in `stories.js` for fetching the stories
- Add a `truncate` helper in `hbs.js`. This helper is supposed to be used to truncate the story body on the card.
- Add a `striptTags` helper in `hbs.js`. This helper is supposed to replace any HTML tag passed on as a string with ''
- Register these helper functions in `app.js` by destructing
- Add the helpers in the Handlebars
- In `index.hbs`:
  - Replace `{{body}}` with `{{stripTags (truncate body)}}`
- **Edit Icon Helper**:
  - Add a `editIcon` helper in `hbs.js`. This helper is supposed to be used to provide an edit icon for the story for the logged in user
  - Register `editIcon` in `app.js`
  - Set a global variable for logged in user in `app.js`
  - Add the following code in `index.hbs`:
    ```js
    {{{editIcon user ../user _id}}}
    ```
    - `user`: refers to the user who created the post
    - `../user`: refers to the user who's logged in. It goes a level up outside the `each` loop to get the logged in user which is stored as a global variable in `app.js`.
    - `_id`: refers to the id of the story
      **[NOTE:** In order to parse HTML using handlebars, you need to use triple curly braces.**]**

---

### Misc 7

**Edit Story**:

- Add GET route for `stories/edit` page in `stories.js`
- Create `./views/stories/edit.hbs` and copy-paste the contents of `add.hbs` and rename the header to **Edit Story**.
  - Make necessary adjustments in the `edit.hbs`
  - Add a `select` helper in `hbs.js`. This helper is supposed to retrieve the already selected status of the story (public/private) in case of editing a story
  - Register this helper
- Add middleware for `method-override` in `app.js`. Required for **PUT**.
- Add the following as the first child under `form` in `edit.hbs`:
  ```html
  <input type="hidden" name="_method" value="PUT" />
  ```
  **[NOTE:** The way that `method-override` works is that it'll replace the method of the form with the one given in the hidden input.**]**
- Create PUT route for updating a story in `stories.js`

---

### Misc 8

**Method Override for DELETE requests**:

- In `dashboard.hbs`:
  - Add an edit icon alongside each story, with an anchor having `href="/stories/edit/{{_id}}"`.
  - Add the following code for **DELETE**:
    ```html
    <form action="/stories/{{_id}}" method="POST" id="delete-form">
      <input type="hidden" name="_method" value="DELETE" />
      <button type="submit" class="btn red">
        <i class="fas fa-trash"></i>
      </button>
    </form>
    ```
- Add route for **DELETE** in `stories.js`

---

### Misc 9

**Single story page**:

- Implement GET route for fetching single story in `stories.js`
- Add a new template `show.hbs` under `./views/stories/` and add necessary code to render a single story content

---

### Misc 10

**User stories**:

- Create a GET route for fetching all public stories created by a user in `stories.js`

---