const db = require('../database/queries')


async function createFolder(req,res) {
    let userId = req.session.passport.user;
    let folderName = req.body.folderName;

    let parentId;

    if (!req.params.path) parentId = null;
    else 

    {
        if (req.params.path.includes('/'))
        {
            let pathParts = req.params.path.split('/');
            parentId = pathParts[pathParts.length-1];

        }
        else 
        parentId = req.params.path;
    }

    let pathField = `/${req.params.path}`;

    let folder = await db.createFolder(userId, folderName, parentId, pathField);

    res.redirect('/folders');
}

async function renderFolders(req,res)
{
    let id = req.session.passport.user;

    let folders = await db.getUserFolders(id);
    res.render('folders',{folders, authenticated: req.isAuthenticated()}) ;
}



module.exports = {createFolder, renderFolders}