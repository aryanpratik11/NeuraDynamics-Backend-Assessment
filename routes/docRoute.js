import express from "express";
import authenticateToken from "../middleware/auth.js";
import upload from "../utils/multer.js";
import { deleteDocument, getDocuments, updateDocument, uploadDocument } from "../controllers/docController.js";


const docRouter = express.Router();

docRouter.post("/upload", authenticateToken, upload.single("file"), uploadDocument);
//upload route- authenticates- saves to local upload folder (multer) - saves metadata route
docRouter.get("/", authenticateToken, getDocuments); // authenticate- get documents route
docRouter.patch("/:id", authenticateToken, updateDocument); // authenticate- update documents route
docRouter.delete("/:id", authenticateToken, deleteDocument); // authenticate- delete documents route

export default docRouter;
