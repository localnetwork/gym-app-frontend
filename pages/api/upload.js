import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable built-in bodyParser
  },
};

export default async function handler(req, res) {
  const uploadDir = './public/files';

  try {
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Extract the filename from the request headers
    const filename = req.headers['x-filename'];

    if (!filename) {
      return res.status(400).json({ error: 'No filename specified in headers' });
    }

    // Define the file path
    const filePath = path.join(uploadDir, filename);

    // Create a writable stream and pipe the request to the file
    const writeStream = fs.createWriteStream(filePath);
    req.pipe(writeStream);

    writeStream.on('finish', () => {
      // Respond with success message or data
      res.status(200).json({ filename });
    });

    writeStream.on('error', (error) => {
      console.error('Error writing file:', error);
      res.status(500).json({ error: 'Error uploading file' });
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
} 