const db = require('../database/queries')
const axios = require('axios')

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


module.exports = 
    handlePreview
