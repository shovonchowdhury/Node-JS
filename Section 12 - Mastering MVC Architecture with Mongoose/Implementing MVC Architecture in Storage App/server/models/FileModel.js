import { model, Schema } from "mongoose";

const FileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    parentDirId: {
        type: Schema.Types.ObjectId,
        ref: "Directory"
    },
    extension: {
        type: String,
        required: true
    }
},
{
    strict: "throw"
}); 

const FileModel = model("File", FileSchema);
export default FileModel;
