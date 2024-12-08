const express = require('express'); // Import express
const router = express.Router();   // Create a router instance

const userController = require('../controllers/userController');
const folderController = require('../controllers/folderController');



  
  
router.get('/:path(*)', (req,res) => {
    //
    userController.renderAuthUser(req,res);
  })
  
  router.post('/delete/:path(*)', (req,res) => {
    // handle deleting folder
    folderController.deleteFolder(req,res);
  })
  
  
  router.post('/create-folder', (req,res) => {
    folderController.createFolder(req,res);
  
  })
  
  router.post('/create-folder/:path(*)', (req,res) => {
    const folderPath = req.params.path;
    folderController.createFolder(req,res);
  })
  

  module.exports = router;