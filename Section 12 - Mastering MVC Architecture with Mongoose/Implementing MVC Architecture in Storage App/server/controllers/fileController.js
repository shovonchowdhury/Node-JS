import { createWriteStream } from "fs";
import { rm } from "fs/promises";
import path from "path";
import FileModel from "../models/FileModel.js";
import DirectoryModel from "../models/DirectoryModel.js";
export const getFile = async (req, res) => {
  const { id } = req.params;
  const fileData = await FileModel.findOne({
    _id: id,
    userId: req.user._id,
  }).lean();
  // Check if file exists
  if (!fileData) {
    return res.status(404).json({ error: "File not found!" });
  }

  // If "download" is requested, set the appropriate headers
  const filePath = `${process.cwd()}/storage/${id}${fileData.extension}`;

  if (req.query.action === "download") {
    return res.download(filePath, fileData.name);
  }

  // Send file
  return res.sendFile(filePath, (err) => {
    if (!res.headersSent && err) {
      return res.status(404).json({ error: "File not found!" });
    }
  });
}

export const uploadFile = async (req, res, next) => {
  const parentDirId = req.params.parentDirId || req.user.rootDirId;
  const parentDirData = await DirectoryModel.findOne({
    _id: parentDirId,
    userId: req.user._id,
  }).lean();

  // Check if parent directory exists
  if (!parentDirData) {
    return res.status(404).json({ error: "Parent directory not found!" });
  }

  const filename = req.headers.filename || "untitled";
  const extension = path.extname(filename);

  const insertedFile = await FileModel.create({
    extension,
    name: filename,
    parentDirId: parentDirData._id,
    userId: req.user._id,
  });
  const fileId = insertedFile.id;

  const fullFileName = `${fileId}${extension}`;

  const writeStream = createWriteStream(`./storage/${fullFileName}`);
  req.pipe(writeStream);

  req.on("end", async () => {
    return res.status(201).json({ message: "File Uploaded" });
  });

  req.on("error", async () => {
    await FileModel.deleteOne({ _id: insertedFile.insertedId });
    return res.status(404).json({ message: "Could not Upload File" });
  });
}

export const updateFile = async (req, res, next) => {
    const { id } = req.params;
    const fileData = await FileModel.findOne({
      _id: id,
      userId: req.user._id,
    }); 
  
    // Check if file exists
    if (!fileData) {
      return res.status(404).json({ error: "File not found!" });
    }
  
    try {
      fileData.name = req.body.newFilename;
      await fileData.save();
      return res.status(200).json({ message: "Renamed" });
    } catch (err) {
      err.status = 500;
      next(err);
    }
  }

  export const deleteFile = async (req, res, next) => {
    const { id } = req.params;
    const fileData = await FileModel.findOne({
      _id: id,
      userId: req.user._id,
    }).select("extension");
  
    if (!fileData) {
      return res.status(404).json({ error: "File not found!" });
    }
  
    try {
      await rm(`./storage/${id}${fileData.extension}`);
      await fileData.deleteOne();
      return res.status(200).json({ message: "File Deleted Successfully" });
    } catch (err) {
      next(err);
    }
  }
    
