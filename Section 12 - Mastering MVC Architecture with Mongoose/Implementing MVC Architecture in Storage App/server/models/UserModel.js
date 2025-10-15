import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        minLength: [3, "Name must be at least 3 characters long"],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"]
      },
    password: {
        type: String,
        required: true,
        minLength: [4, "Password must be at least 4 characters long"]
    },
    rootDirId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Directory"
    }
},
{
    strict: "throw",
});

const UserModel = model("User", UserSchema);

export default UserModel;