const db = require("../database/queries");

async function fileUpload(req, res, next) {
  let folderId = req.params.folder;


  let file = await db.addFile(folderId, req.file);

  console.log(file);
  res.redirect(`/?folder=${folderId}`);
}

module.exports = { fileUpload };

/*  
{
  fieldname: "file",
  originalname: "wallhaven-l86l5p_1920x1080.png",
  encoding: "7bit",
  mimetype: "image/png",
  destination: "uploads/",
  filename: "474f03621a75858e1881aef2192d6659",
  path: "uploads/474f03621a75858e1881aef2192d6659",
  size: 2911687,
}
*/
