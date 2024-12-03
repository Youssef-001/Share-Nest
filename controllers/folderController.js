const db = require('../database/queries')


async function createFolder(req,res) {
    console.log(req);
    let userId = req.session.passport.user;
    let folderName = req.body.folderName;

    let folder = await db.createFolder(userId, folderName);

    res.redirect('/');
}

async function renderFolders(req,res)
{
    let id = req.session.passport.user;

    let folders = await db.getUserFolders(id);
    res.render('folders',{folders, authenticated: req.isAuthenticated()}) ;
}



module.exports = {createFolder, renderFolders}