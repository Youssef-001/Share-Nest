const db = require("../database/queries");

async function fileUpload(req, res, next) {
  let folderId = req.params.folder;



  let fileSize = parseFloat(req.file.size);
  fileSize/=1024;
  fileSize/=1024;

  fileSize = (fileSize).toFixed(2);

  req.file = {...req.file, size: fileSize}
  let file = await db.addFile(folderId, req.file);

  console.log(file);
  res.redirect(`/folder/${folderId}`);
}

module.exports = { fileUpload };


