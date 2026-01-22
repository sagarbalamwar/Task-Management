import mongoose, {
    Schema
} from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    ownerId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})
export const Task=mongoose.model("Task",taskSchema)