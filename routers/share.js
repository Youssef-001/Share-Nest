const express = require('express'); // Import express
const router = express.Router();   // Create a router instance
const shareController = require('../controllers/shareController');
const checkLink = require('../controllers/linkMiddleware');

router.get('/:folder_id', checkLink, (req,res) => {
    console.log(req.session);
    shareController.handleShare(req,res);
  })
  
  
  router.post('/folder/:path(*)', (req,res) => {
    console.log(req.body);
    shareController.shareFolder(req,res);
  })



module.exports = router;