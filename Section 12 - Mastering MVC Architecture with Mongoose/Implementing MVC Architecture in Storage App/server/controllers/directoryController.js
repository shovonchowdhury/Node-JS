import { rm } from "fs/promises";
import DirectoryModel from "../models/DirectoryModel.js";
import FileModel from "../models/FileModel.js";

export const getDirectories= async(req, res)=>{
  const user = req.user;
  const _id = req.params.id || user.rootDirId;
  const directoryData = await DirectoryModel.findOne({ _id }).lean();
  if (!directoryData) {
    return res
      .status(404)
      .json({ error: "Directory not found or you do not have access to it!" });
  }

  const files = await FileModel.find({ parentDirId: directoryData._id }).lean();
  const directories = await DirectoryModel.find({ parentDirId: _id }).lean();
  return res.status(200).json({
    ...directoryData,
    files: files.map((file) => ({ ...file, id: file._id })),
    directories: directories.map((dir) => ({ ...dir, id: dir._id })),
  });
}

export const createDirectory=async (req, res, next) => {
  const user = req.user; 
  const parentDirId = req.params.parentDirId || user.rootDirId;
  const dirname = req.headers.dirname || "New Folder";
  try {
    const parentDir = await DirectoryModel.findOne({
      _id: parentDirId,
    }).lean();

    if (!parentDir)
      return res
        .status(404)
        .json({ message: "Parent Directory Does not exist!" });
    
    await DirectoryModel.create({
      name: dirname,
      parentDirId:parentDirId,
      userId: user._id,
    });

    return res.status(201).json({ message: "Directory Created!" });
  } catch (err) {
    if (err.code === 121) {
      res
        .status(400)
        .json({ error: "Invalid input, please enter valid details" });
    } else {
      next(err);
    }
  }
}

export const updateDirectory=async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const { newDirName } = req.body;
  try {
    await DirectoryModel.updateOne(
      {
        _id: id,
        userId: user._id,
      },
      { name: newDirName }
    );
    res.status(200).json({ message: "Directory Renamed!" });
  } catch (err) {
    next(err);
  }
}

export const deleteDirectory=async (req, res, next) => {
    const { id } = req.params;
    try{
      const dirObjId = id;
  
    const directoryData = await DirectoryModel.findOne(
      {
        _id: dirObjId,
        userId: req.user._id,
      },
      { projection: { _id: 1 } }
    );
  
    if (!directoryData) {
      return res.status(404).json({ error: "Directory not found!" });
    }
  
    async function getDirectoryContents(id) {
      let files = await FileModel.find({ parentDirId: id }).select("extension").lean();
      let directories = await DirectoryModel.find({ parentDirId: id }).select("_id").lean();
  
      for (const { _id } of directories) {
        const { files: childFiles, directories: childDirectories } =
          await getDirectoryContents(_id);
  
        files = [...files, ...childFiles];
        directories = [...directories, ...childDirectories];
      }
  
      return { files, directories };
    }
  
    const { files, directories } = await getDirectoryContents(dirObjId);
  
    for (const { _id, extension } of files) {
      await rm(`./storage/${_id.toString()}${extension}`);
    }
  
    await FileModel.deleteMany({
      _id: { $in: files.map(({ _id }) => _id) },
    });
  
    await DirectoryModel.deleteMany({
      _id: { $in: [...directories.map(({ _id }) => _id), dirObjId] },
    });
    }
    catch(err){
      next(err);
    }
  
    return res.json({ message: "Files deleted successfully" });
  }