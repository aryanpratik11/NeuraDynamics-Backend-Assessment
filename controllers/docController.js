//Document controller- upload, retrieve, update, and delete documents 
// Ownership is enforced

import fs from "fs";
import pool from "../config/db.js";

// Upload a document
export const uploadDocument = async (req, res) => {
    const { title, categoryId } = req.body;

    if (!title || !categoryId || !req.file) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        await pool.query(
            `INSERT INTO documents (title, file_path, user_id, category_id) VALUES ($1, $2, $3, $4)`,
            [title, req.file.path, req.user.id, categoryId]
        );// store metadata in database

        res.status(201).json({ message: "Document uploaded successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
};

export const getDocuments = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT d.id, d.title, d.file_path, d.created_at, c.name AS category
            FROM documents d
            JOIN categories c ON d.category_id = c.id
            WHERE d.user_id = $1
            ORDER BY d.created_at DESC`,
            [req.user.id]
        ); // Fetch all documents belonging to the user

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch documents" });
    }
};

export const updateDocument = async (req, res) => {
    const documentId = req.params.id;
    const { title, categoryId } = req.body;

    if (!title && !categoryId) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM documents WHERE id = $1",
            [documentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Document not found" });
        }

        const document = result.rows[0];

        if (document.user_id !== req.user.id) { // Ownership enforcement
            return res.status(403).json({ error: "Forbidden" });
        }

        // Update document metadata
        const updatedTitle = title || document.title;
        const updatedCategoryId = categoryId || document.category_id;

        await pool.query(
            `UPDATE documents
            SET title = $1, category_id = $2
            WHERE id = $3`,
            [updatedTitle, updatedCategoryId, documentId]
        );

        res.json({ message: "Document updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Update failed" });
    }
};

export const deleteDocument = async (req, res) => {
    const documentId = req.params.id;

    try {
        // find document
        const result = await pool.query(
            "SELECT * FROM documents WHERE id = $1",
            [documentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Document not found" });
        }

        const document = result.rows[0];

        // Ownership check
        if (document.user_id !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        // Delete file from disk
        fs.unlink(document.file_path, (err) => {
            if (err) console.error("File delete error:", err);
        });

        // Delete record from DB
        await pool.query(
            "DELETE FROM documents WHERE id = $1",
            [documentId]
        );

        res.json({ message: "Document deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete failed" });
    }
};