const bcrypt = require("bcryptjs");
const db = require("../database/queries");
const axios = require("axios");
const fs = require("fs");
const handlePreview = require("./previewController");
function createUser(req, res, next) {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) return next(err);
      else {
        console.log(req.body);
        let userData = { ...req.body, hashedPassword };
        await db.createUser(userData);
        console.log("user id: ", userData.id);
        let user = await db.getUserId(userData.email);
        let userId = user.id;
        await db.createInitialFolder(userId);
        res.redirect("/");
      }
    });
  } catch (err) {
    return next(err);
  }
}

function handleSearchQuery(query, currentFiles) {
  let searchFiles = [];
  if (query != undefined) {
    for (let i = 0; i < currentFiles.length; i++) {
      if (
        currentFiles[i].name
          .toLocaleLowerCase()
          .startsWith(query.toLocaleLowerCase())
      ) {
        searchFiles.push(currentFiles[i]);
      }
    }
  }

  return searchFiles;
}

async function renderAuthUser(req, res) {

  let folderId = -1;
  if (req.params.path != undefined)
  {
  if (req.params.path.includes('/'))
  {
    let pathSegments = req.params.path.split('/');
    folderId = pathSegments[pathSegments.length - 1];
  }
  else {
    folderId = req.params.path;
  }
}

if (folderId == -1)
{
  folderId = await db.getUserFirstFolder(req.session.passport.user);
  folderId=folderId.id;
}


  let userId = req.session.passport.user;
  let userFolders = await db.getUserFolders(userId);


  for (let i = 0; i < userFolders.length; i++)
  {
    let subFolders = await db.getSubFolders(userFolders[i].id);
    userFolders[i] = {...userFolders[i], children: subFolders};
  }

  let currentFiles;
  let folderName;

  if (folderId != undefined) {
    currentFiles = await db.GetFolderFiles(folderId);
    folderName = (await db.getFolderName(folderId));
    folderName = folderName.name;
  } else {
    currentFiles = await db.GetFolderFiles(userFolders[0].id);
    folderName = (await db.getFolderName(userFolders[0].id))
    folderName = folderName.name
  }

  for (let i = 0; i < currentFiles.length; i++) {
    let file = currentFiles[i];
    let newDate = String(file.Date);
    console.log(newDate.substring(0, 16));
    let date = newDate.substring(0, 25);

    let newExtension = file.extention.split(".")[1];
    currentFiles[i] = { ...file, Date: date };
  }
  console.log(currentFiles);
  let previewObj = await handlePreview(req, res);

  if (req.query.search != undefined) {
    currentFiles = handleSearchQuery(req.query.search, currentFiles);
  }

  // query give it current folder, that returns tree of nested folders



  let tree = await db.getFolderPath(folderId);;

  
  let rootFolders = userFolders.filter((folder) => {
    return folder.parentId == null;
  })


  console.log(tree);

  res.render("index", {
    authenticated: req.isAuthenticated(),
    folders: rootFolders,
    files: currentFiles,
    currentFolder: { id: req.params.folderId, name: folderName },
    previewObj,
    folderPath: tree
  });
}

module.exports = {
  createUser,
  renderAuthUser,
  handlePreview,
  handleSearchQuery,
};
