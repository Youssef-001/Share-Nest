const bcrypt = require("bcryptjs");
const db = require('../database/queries')
const fs = require('fs');
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



async function handlePreview(req)
{
    let previewObj = {preview:false};

    if (req.query.preview != undefined) {
        let file = await db.getFileById(parseInt(req.query.preview));
        
        console.log(file);
    
        if (file.extention.startsWith('text')) {
            try {
                const data = fs.readFileSync(file.url, 'utf8');
                
                console.log('File content:', data);
                
                file = { ...file, content: data };
                previewObj['file'] = file;
                previewObj['type'] = "text";
                previewObj['preview'] = true;
    
                console.log(previewObj);
            } catch (err) {
                console.error('Error reading the file:', err);
            }
            let newContent = previewObj.file.content.replaceAll('\n', '<br>')
            previewObj.file = {...previewObj.file, content:newContent};
        }

        else if (file.extention.startsWith('image'))
        {
            const image = fs.readFileSync(file.url);
            previewObj['preview'] = true;
            previewObj['type'] = "image";
            previewObj['file'] = file;
        }

        else if (file.extention.split('/')[1] == 'pdf')
        {
            previewObj['preview'] = true;
            previewObj['file'] = file;
            previewObj['type'] = "pdf";
        }
    }

    return previewObj;
}



function handleSearchQuery(query, currentFiles)
{
    let searchFiles = [];
        if (query != undefined)
        {
            for (let i = 0; i < currentFiles.length; i++)
            {
                if ((currentFiles[i].name.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())))
                {   
                    searchFiles.push(currentFiles[i])
                    
                }
            }
        }

        return searchFiles
}


async function renderAuthUser(req,res)
{ 
    let userId = req.session.passport.user;
        let userFolders = await db.getUserFolders(userId);
        console.log(userFolders)


        let currentFiles;

        if (req.params.folderId != undefined)
        {
            currentFiles = await db.GetFolderFiles(req.params.folderId);
        }
        else {
            currentFiles = await db.GetFolderFiles(userFolders[0].id);
        }

        for (let i = 0; i < currentFiles.length; i++)
        {
            let file = currentFiles[i];
        let newDate = String(file.Date);
        console.log(newDate.substring(0, 16))
        let date = newDate.substring(0,16);
        
            let newExtension = file.extention.split('.')[1];
            currentFiles[i] = {...file,Date: date}

        }
        console.log(currentFiles)
        let previewObj = await handlePreview(req);

        if (req.query.search != undefined)
        {

            currentFiles = handleSearchQuery(req.query.search, currentFiles);
        }

        res.render("index", {authenticated: req.isAuthenticated(), folders: userFolders, files: currentFiles, currentFolder: req.params.folderId, previewObj});

}



module.exports = {createUser,renderAuthUser}