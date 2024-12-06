const db = require("../database/queries");
const cloud = require('../cloudinary');

async function fileUpload(req, res, next) {
  let folderId;

  if (req.params.path.includes('/'))
  {
    let folderSegments = req.params.path.split('/');
    folderId = folderSegments[folderSegments.length  - 1];
  }
  
  else {
    folderId = req.params.path;
  }



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


async function deleteFile(req,res) {
  let fileId = req.params.fileId;
  let file = await db.getFileById(fileId);
  let public_id = file.url.split('/foo');
  public_id = public_id[1];
  public_id = public_id.split('.');
  public_id = public_id[0];
  public_id = `foo${public_id}`;

  cloud.deleteFileCloud(public_id);
  await db.deleteFile(fileId);

  res.redirect('/');
}




module.exports = { fileUpload,deleteFile };


