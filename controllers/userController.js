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
{ // TODO: get first folder for user and query it on default;
    let userId = req.session.passport.user;
        let userFolders = await db.getUserFolders(userId);
        console.log(userFolders)


        let currentFiles;

        if (req.query.folder != undefined)
        {
            currentFiles = await db.GetFolderFiles(req.query.folder);
        }
        else {
            currentFiles = await db.GetFolderFiles(userFolders[0].id);
        }

    

        // let defaultFolder = await db.getUserFirstFolder(userId);
        // let currentFolders = [];
        // if (req.query.folder == undefined)
        //     currentFolders.push(defaultFolder);
        // else 
        // currentFolders.push(folderFiles);

        console.log(currentFiles);
        console.log((currentFiles[0].Date))
        console.log(currentFiles[0].Date.getFullYear())


        for (let i = 0; i < currentFiles.length; i++)
        {
            let file = currentFiles[i];
        //    let newDate = `${file.Date.getFullYear()}-${file.Date.getMonth()}-${file.Date.getDay()}`
        let newDate = String(file.Date);
        console.log(newDate.substring(0, 16))
        let date = newDate.substring(0,16);
        
            currentFiles[i] = {...file, Date: date};

        }

        console.log(currentFiles)

        res.render("index", {authenticated: req.isAuthenticated(), folders: userFolders, files: currentFiles, currentFolder: req.query.folder});

}


module.exports = {createUser,renderAuthUser}