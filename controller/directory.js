import mongoose from "mongoose";
import Directory from "../models/directory.js";

const buildTree = (nodes, parentId = null) => {
  return nodes
    .filter((node) => node.parentId?.toString() === parentId?.toString())
    .map((node) => ({
      ...node._doc,
      children: buildTree(nodes, node._id),
    }));
};

//Get all files and folders list
export const getAllFilesAndFolders = async (req, res) => {
  try {
    const directories = await Directory.find();
    const tree = buildTree(directories);
    res.status(200).json({ data: tree });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST all files and folders
export const createFilesAndFolders = async (req, res) => {
  const { name, type, parentId } = req.body;
  const newDirectory = new Directory({ name, type, parentId });
  try {
    if (parentId) {
      const parentFolder = await Directory.findById(parentId);
      if (!parentFolder) {
        return res.status(404).json({ message: "Parent folder not found" });
      }
      await Directory.findByIdAndUpdate(parentFolder, {
        $push: { children: newDirectory._id },
      });
    }

    const saveItem = await newDirectory.save();
    res.status(201).json({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} created`,
      data: saveItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update files and folder
export const updateFilesAndFolders = async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("No directory with that id");

    const findDirectory = await Directory.findById(id);
    if (!findDirectory) {
      return res.status(404).send("No directory found with that ID");
    }
    findDirectory.name = name;
    findDirectory.type = type;
    await findDirectory.save();
    res.status(200).json({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} updated`,
      data: findDirectory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Move files and folders to different locations

export const moveByFileAndFolder = async (req, res) => {
  const { sourceId, destinationId } = req.body;
  try {
    if (
      !mongoose.Types.ObjectId.isValid(sourceId) ||
      !mongoose.Types.ObjectId.isValid(destinationId)
    ) {
      return res.status(404).json({ message: "No directory with that id" });
    }

    const sourceDirectory = await Directory.findById(sourceId);
    const destinationDirectory = await Directory.findById(destinationId);
    if (destinationDirectory.type !== "folder") {
      return res.status(400).json({ message: "Destination must be a folder" });
    }
    // Step 1: remove the source parentID's children reference
    const previousParenId = sourceDirectory.parentId;
    if (previousParenId) {
      const previousParentDirectory = await Directory.findByIdAndUpdate(
        previousParenId,
        {
          $pull: { children: sourceDirectory._id },
        }
      );
    }

    // Step 2: add the sourceID to the destination parentID's children array
    const updatedParentDirectory = await Directory.findByIdAndUpdate(
      destinationId,
      {
        $push: { children: sourceDirectory._id },
      }
    );

    // Step 3: update the source's parentID to the new destination ID
    await Directory.findByIdAndUpdate(sourceId, {
      parentId: destinationId,
    });
    res.status(200).json({ message: "Moved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChildrenIds = async (ids) => {
  let allChildrenIds = [...ids];
  const directories = await Directory.find({ _id: { $in: ids } }).lean();
  for (const dir of directories) {
    if (dir.children && dir.children.length > 0) {
      const childIds = dir.children.map((child) => child._id.toString());
      const childIdsFromRecursion = await getChildrenIds(childIds);
      allChildrenIds.push(...childIdsFromRecursion);
    }
  }
  return allChildrenIds;
};

// Delete files and folders
export const deleteByFileAndFolder = async (req, res) => {
  const { ids, parentId } = req.body;
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const childrenIds = await getChildrenIds(ids);
    const allIds = new Set([...ids, ...childrenIds]);
    if (parentId) {
      // Remove the directories from their parent's children array
      await Directory.updateMany(
        { _id: { $in: parentId } },
        { $pull: { children: { $in: ids } } }
      );
    }
    // Delete directories with the collected ids
    await Directory.deleteMany({ _id: { $in: Array.from(allIds) } });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
