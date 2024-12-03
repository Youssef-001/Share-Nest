const db = require('../database/queries')

const checkLink = async(req,res,next) => {
    let shared_folder_id = req.params.folder_id;
    
    let shared_folder = await db.getSharedFolder(shared_folder_id);

    let createdAt =  new Date(shared_folder.createdAt);
    let expiresAt = new Date(shared_folder.expiresAt);
    let now = new Date();

    console.log("expire: ", expiresAt);
    console.log("noww" , now);
    if (expiresAt <= now)
    {
        res.status(400).render('expired')
    }



    next();
}

module.exports = checkLink