const db = require("../database/queries");
const cloud = require('../cloudinary');

async function fileUpload(req, res, next) {
  let folderId = req.params.folder;



  let fileSize = parseFloat(req.file.size);
  fileSize/=1024;
  fileSize/=1024;

  fileSize = (fileSize).toFixed(2);

  let cloudPath = await cloud.uploadFile(req.file.buffer);



  // req.file = {...file, path: cloudPath};

  req.file = {...req.file, size: fileSize, path: cloudPath}
  let file = await db.addFile(folderId, req.file);

  console.log(file);
  res.redirect(`/folder/${folderId}`);
}

module.exports = { fileUpload };


