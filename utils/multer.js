// Multer configuration for handling file uploads

import multer from "multer";

const storage = multer.diskStorage({ //disk storage configuration
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname; //unique filename(timestamp prefixes)
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;