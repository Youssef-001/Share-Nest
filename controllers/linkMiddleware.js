const db = require('../database/queries')

const checkLink = async(req,res,next) => {
    let shared_folder_id = req.params.folder_id;
    
    let shared_folder = await db.getSharedFolder(shared_folder_id);

    let createdAt =  new Date(shared_folder.createdAt);
    let expiresAt = new Date(shared_folder.expiresAt);

    if (expiresAt >= createdAt)
    {
        res.render('expired')
    }


    
    next();
}

module.exports = checkLink