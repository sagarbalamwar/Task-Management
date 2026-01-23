import mongoose, {
    Schema
} from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        select: false
    },
    description: {
        type: String,
        required: false,
        select:false
    },
    ownerId: {
        type: String,
        required: true,
        select:false
    }
}, {
    timestamps: true
})
export const Task=mongoose.model("Task",taskSchema)