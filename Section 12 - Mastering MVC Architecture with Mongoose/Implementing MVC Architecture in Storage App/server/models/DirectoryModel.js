import { model, Schema } from "mongoose";

const DirectorySchema = new Schema({
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
        default: null,
        ref: "Directory"
    }
},
{
    strict: "throw",
});

const DirectoryModel = model("Directory", DirectorySchema);

export default DirectoryModel;
