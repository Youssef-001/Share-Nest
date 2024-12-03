const db = require('../database/queries')
const handlePreview = require('./previewController');
const userController = require('./userController')


async function shareFolder(req,res)
{
    let expiry = req.body.expiry;

    let folderId = req.params.folderId;

    let currentDate = new Date();
    let daysToAdd = parseInt(expiry.split('-')[0]);

    let newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + daysToAdd);



    let sharedFolder = await db.createShareFolder(folderId, newDate);

    const folderLink = sharedFolder.id; // Assuming this is the folder link you want to send
    res.json({folderLink});

}

async function handleShare(req,res)
{

    let shared_folder_id = req.params.folder_id;
    
    let shared_folder = await db.getSharedFolder(shared_folder_id);


    let isAuth = req.isAuthenticated();

    let files = shared_folder.shareFolder.files;


    let previewObj = await handlePreview(req,res);
    
    for (let i = 0; i < files.length; i++)
        {
            let file = files[i];
        let newDate = String(file.Date);
        console.log(newDate.substring(0, 25))
        let date = newDate.substring(0,25);
        
            files[i] = {...file,Date: date}

        }
        if (req.query.search)
        {
        files = userController.handleSearchQuery(req.query.search, files)
        }
    res.render('shared', {authenticated: isAuth, share_id: shared_folder_id ,files:files, currentFolder: shared_folder.shareFolder.id , previewObj})

}


module.exports = {
    handleShare ,
    shareFolder
}