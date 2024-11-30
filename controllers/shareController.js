const db = require('../database/queries')
const handlePreview = require('./previewController');


async function handleShare(req,res)
{

    let shared_folder_id = req.params.folder_id;
    
    let shared_folder = await db.getSharedFolder(shared_folder_id);

    // handle link duration

    let isAuth = req.isAuthenticated();

    let files = shared_folder.shareFolder.files;

    let createdAt =  new Date(shared_folder.createdAt);
    let expiresAt = new Date(shared_folder.expiresAt);

    if (expiresAt >= createdAt)
    {
        //res.render('expired')
    }


    let previewObj = await handlePreview(req,res);

    res.render('shared', {authenticated: isAuth, files:files, currentFolder: shared_folder.shareFolder.id , previewObj})
//        res.render("index", {authenticated: req.isAuthenticated(), folders: userFolders, files: currentFiles, currentFolder: req.params.folderId, previewObj});

}


module.exports = {
    handleShare 
}