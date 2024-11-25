const express = require('express');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const app = express();
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const path = require('path')

const db = require('./database/queries')
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get('/', (req,res) => {
    res.render('index');
})




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



app.get('/sign-up', (req,res) => {
    res.render('sign-up');
})

app.post("/sign-up", async (req, res, next) => {
    try {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {

        if (err) return next(err);
        else {
            console.log(req.body);
          let userData = {...req.body, hashedPassword}
          await db.createUser(userData)
          res.redirect("/");
        }
      });
    } catch (err) {
      return next(err);
    }
  });

  passport.use(
    { usernameField: 'email' },
    new LocalStrategy(async (email, password, done) => {
      try {
        const user = await db.getUser(email);
        console.log("user is: ", user);
  
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
  
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
  
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
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
  

app.listen(3000, (req,res)=>{})