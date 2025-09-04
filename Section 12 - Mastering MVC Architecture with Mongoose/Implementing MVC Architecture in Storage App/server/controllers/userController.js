import { client } from "../config/db.js";
import { ObjectId } from "mongodb";

export const registerUser =  async (req, res, next) => {
    const { name, email, password } = req.body;
    const db = req.db;
    const foundUser = await db.collection("users").findOne({ email });
    if (foundUser) {
      return res.status(409).json({
        error: "User already exists",
        message:
          "A user with this email address already exists. Please try logging in or use a different email.",
      });
    }
    const session = client.startSession();
  
    try {
      const rootDirId = new ObjectId();
      const userId = new ObjectId();
      const dirCollection = db.collection("directories");
  
      session.startTransaction();
  
      await dirCollection.insertOne(
        {
          _id: rootDirId,
          name: `root-${email}`,
          parentDirId: null,
          userId,
        },
        { session }
      );
  
      await db.collection("users").insertOne(
        {
          _id: userId,
          name,
          email,
          password,
          rootDirId,
        },
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
      } else {
        next(err);
      }
    }
  }

  export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    const db = req.db;
    const user = await db.collection("users").findOne({ email, password });
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
    
