const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const app = express();
const expressSession = require("express-session");
const PrismaSessionStore = require('./database/store');
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const PrismaStore = require('@quixo3/prisma-session-store').PrismaSessionStore;
const db = require("./database/queries");
app.use(express.urlencoded({ extended: false }));
const prisma = new PrismaClient();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fileController = require('./controllers/fileController')
const userController = require('./controllers/userController')
const folderController = require('./controllers/folderController')
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static('uploads'))
app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);
app.use(passport.initialize());
app.use(passport.session());


app.get("/", async(req, res) => {
  console.log(req.query)
  let firstFolder = await db.getUserFirstFolder(req.session.passport.user);
  if (req.query.folder==undefined)
  {
    res.redirect(`/?folder=${firstFolder.id}`);
  }
  if (req.isAuthenticated() == false)
    res.redirect('/login');
  else{
    userController.renderAuthUser(req,res);
  }
});


app.get("/sign-up", (req, res) => {
  res.render("sign-up", {authenticated: req.isAuthenticated()});
});

app.get("/login", (req, res) => {
  console.log(req.isAuthenticated());
  res.render("login", {authenticated: req.isAuthenticated()});
});

app.post("/sign-up", async (req, res, next) => {
  userController.createUser(req,res,next);
  
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await db.getUser(email);
        console.log("user is: ", user);

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.post('/upload/:folder', upload.single('file'), function (req, res, next) {
  console.log(req.file);
  fileController.fileUpload(req,res,next);
})

app.post('/create-folder', (req,res) => {
  folderController.createFolder(req,res);
})


app.use((req, res, next) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);
  console.log('Is Authenticated:', req.isAuthenticated());
  next();
});


app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.listen(3000, (req, res) => {});
