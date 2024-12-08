const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const app = express();
const expressSession = require("express-session");
const PrismaSessionStore = require('./database/store');
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const db = require("./database/queries");
app.use(express.urlencoded({ extended: false }));
const multer  = require('multer')
const upload = multer()
const fileController = require('./controllers/fileController')
const folderController = require('./controllers/folderController')

require('dotenv').config();

const sign_up_router = require('./routers/sign-up.js');
const folder_router = require('./routers/folder.js');
const share_router = require('./routers/share.js');
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const isAuth = require('./controllers/authController.js')
app.use(express.json());


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

  if (req.isAuthenticated() == false)
    res.redirect('/login');
  else{
    res.redirect('/folders');

  }
});

app.use('/sign-up', sign_up_router)


app.get("/login", (req, res) => {
  console.log(req.isAuthenticated());
  res.render("login", {authenticated: req.isAuthenticated()});
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



app.post('/upload/:path(*)', upload.single('file'), function (req, res, next) {
  console.log(req.file);
  if (req.file.mimetype == "application/octet-stream") 
  {
    req.file.mimetype = "application/pdf";
  }
  fileController.fileUpload(req,res,next);
})

app.post('/file/delete/:fileId', (req,res) => {
  fileController.deleteFile(req,res);
})


app.use('/folder', folder_router)

app.get('/folders', (req, res, next) => {
  isAuth(req, res, next); 
}, (req, res) => {
  folderController.renderFolders(req, res); 
});

app.use('/share', share_router);

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

app.listen(process.env.PORT, (req, res) => {});
