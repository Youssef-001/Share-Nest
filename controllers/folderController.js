const db = require('../database/queries')


async function createFolder(req,res) {
    console.log(req);
    let userId = req.session.passport.user;
    let folderName = req.body.folderName;

    let folder = await db.createFolder(userId, folderName);

    res.redirect('/');
}



module.exports = {createFolder}