const bcrypt = require("bcryptjs");
const db = require('../database/queries')
const axios = require('axios');
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



async function handlePreview(req,res) {
    let previewObj = { preview: false };

    if (req.query.preview != undefined) {
        try {
            // Fetch the file from the database
            let file = await db.getFileById(parseInt(req.query.preview));

            // Fetch file content from Cloudinary
            const response = await axios.get(file.url, { responseType: 'arraybuffer' });
            const fileData = Buffer.from(response.data, 'binary');
            if (file.extention.startsWith('application')) // this was cause of problem
            {
                // res.setHeader('Content-Type', 'application/pdf');
            }

            // Handle text files
            if (file.extention.startsWith('text')) {
                try {
                    const content = fileData.toString('utf8'); // Convert binary data to string
                    console.log('File content:', content);

                    let formattedContent = content.replaceAll('\n', '<br>'); // Format for HTML preview
                    previewObj = {
                        preview: true,
                        type: "text",
                        file: { ...file, content: formattedContent }
                    };
                } catch (err) {
                    console.error('Error processing text content:', err);
                }
            }

            // Handle image files
            else if (file.extention.startsWith('image')) {
                previewObj = {
                    preview: true,
                    type: "image",
                    file
                };
            }

            // Handle PDF files
            else if (file.extention.split('/')[1] === 'pdf') {
                previewObj = {
                    preview: true,
                    type: "pdf",
                    file
                };
            }
        } catch (error) {
            console.error('Error fetching or processing file:', error);
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
        let previewObj = await handlePreview(req,res);

        if (req.query.search != undefined)
        {

            currentFiles = handleSearchQuery(req.query.search, currentFiles);
        }

        res.render("index", {authenticated: req.isAuthenticated(), folders: userFolders, files: currentFiles, currentFolder: req.params.folderId, previewObj});

}



module.exports = {createUser,renderAuthUser}