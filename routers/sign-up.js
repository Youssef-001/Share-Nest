const express = require('express'); // Import express
const router = express.Router();   // Create a router instance
const userController = require('../controllers/userController')


router.get("/", (req, res) => {
    res.render("sign-up", {authenticated: req.isAuthenticated()});
  });
  

  router.post("/", async (req, res, next) => {
    userController.createUser(req,res,next);
    
  });


  module.exports = router;