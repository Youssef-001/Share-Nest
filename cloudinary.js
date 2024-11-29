require('dotenv').config()
const cloudinary = require('cloudinary').v2;
let streamifier = require('streamifier');


cloudinary.config({
    cloud_name: "dgy6jnjf0",
    api_key: process.env.CLODUINARY_API_KEY,
    api_secret: process.env.CLODUINARY_API_SECRET
})


async function uploadFile(file) {
    return new Promise((resolve, reject) => {
        try {
            // Ensure the file is a buffer or stream.
            if (!file || !file.buffer) {
                throw new Error("Invalid file object");
            }

            let cld_upload_stream = cloudinary.uploader.upload_stream(
                {
                    folder: "foo", // Folder in Cloudinary where the image will be uploaded
                    resource_type: 'auto'  // Detect the resource type automatically (e.g., image, video)
                },
                function(error, result) {
                    if (error) {
                        console.log("Upload error:", error);
                        reject(error);
                    } else {
                        console.log("Upload successful:", result);
                        resolve(result.secure_url); // Return the secure URL of the uploaded image
                    }
                }
            );

            // Create a readable stream from the file buffer
            streamifier.createReadStream(file).pipe(cld_upload_stream);

        } catch (error) {
            console.error("Error uploading file:", error);
            reject(error);
        }
    });
}

module.exports = {uploadFile}