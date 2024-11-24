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


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get('/', (req,res) => {
    res.send("hi");
})

app.get('/sign-up', (req,res) => {
    res.render('sign-up');
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


app.listen(3000, (req,res)=>{})