// import { client } from "../config/db.js";
import UserModel from "../models/UserModel.js";
import DirectoryModel from "../models/DirectoryModel.js";
import mongoose from "mongoose";

export const registerUser =  async (req, res, next) => {
    const { name, email, password } = req.body;
    const session = await mongoose.startSession();
  
    try {
      const rootDirId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();
  
      session.startTransaction();

      await DirectoryModel.create(
        [
          {
            _id: rootDirId,
            name: `root-${email}`,
            parentDirId: null,
            userId,
          },
        ],
        { session }
      );

      await UserModel.create(
        [
          {
            _id: userId,
            name,
            email,
            password,
            rootDirId,
          },
        ],
        { session }
      );

  
      session.commitTransaction();
  
      res.status(201).json({ message: "User Registered" });
    } catch (err) {
      session.abortTransaction();
      if (err.code === 121) {
        res
          .status(400)
          .json({ error: "Invalid input, please enter valid details" });
      } 
      else if (err.code === 11000) {
        if (err.keyValue.email) {
          return res.status(409).json({
            error: "User already exists",
            message:
              "A user with this email address already exists. Please try logging in or use a different email.",
          });
        }
      }
      else {
        next(err);
      }
    }
  }

  export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ error: "Invalid Credentials" });
    }
    res.cookie("uid", user._id.toString(), {
      httpOnly: true,
      maxAge: 60 * 1000 * 60 * 24 * 7,
    });
    res.json({ message: "Logged In" });
  }

  export const getUser = (req, res) => {
    res.status(200).json({
      name: req.user.name,
      email: req.user.email,
    });
  }

  export const logoutUser =  (req, res) => {
    res.clearCookie("uid");
    res.status(204).end();
  }
    
