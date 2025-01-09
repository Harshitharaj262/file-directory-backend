import express from "express";
import {
  getAllFilesAndFolders,
  createFilesAndFolders,
  updateFilesAndFolders,
  moveByFileAndFolder,
  deleteByFileAndFolder,
} from "../controller/directory.js";

const router = express.Router();

// Get all files / folders
router.get("/", getAllFilesAndFolders);

// POST: Create a new file or folder
router.post("/create", createFilesAndFolders);

// PUT: rename update a file or folder
router.put("/update/:id", updateFilesAndFolders);

// PUT: move files or folders to a new location
router.put("/move", moveByFileAndFolder);

// DELETE: delete a file or folder
router.delete("/delete", deleteByFileAndFolder);

export default router;
