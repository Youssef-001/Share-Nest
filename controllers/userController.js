const bcrypt = require("bcryptjs");
const db = require('../database/queries')

function createUser(req,res,next)
{
    try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) return next(err);
          else {
            console.log(req.body);
            let userData = { ...req.body, hashedPassword };
            await db.createUser(userData);
            console.log('user id: ', userData.id);
            let user = await db.getUserId(userData.email)
            let userId = user.id
            await db.createInitialFolder(userId);
            res.redirect("/");
          }
        });
      } catch (err) {
        return next(err);
      }
}

async function renderAuthUser(req,res)
{
    let userId = req.session.passport.user;
        let userFolders = await db.getUserFolders(userId);
        console.log(userFolders)
        let folderFiles = await db.GetFolderFiles(req.query.folder);
        res.render("index", {authenticated: req.isAuthenticated(), folders: userFolders, files: folderFiles});

}


module.exports = {createUser,renderAuthUser}