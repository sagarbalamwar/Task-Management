import {
    Task
} from "../Model/task.model.js";

const createTask = async function (req, res) {
    const {
        title,
        description
    } = req.body;
    try {
        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            })
        }
        if(typeof title!== 'string' || title.trim().length===0){
            return res.status(400).json({
                error: "Title must non-empty string"
            })
        }
        if(title.trim().length>100){
            return res.status(400).json({
                error: "Title must be less than 100 characters."
            })
        }
        const normalizedTitle=title.trim();
        const normalizedDescription=typeof description ==='string' ? description.trim():"";
        const taskExist=await Task.findOne({
            title:normalizedTitle,
            ownerId: req.user.userId
        });
        if(taskExist){
            return res.status(409).json({
                error: "Task with this title already exist"
            })
        }
        const task = await Task.create({
            title:normalizedTitle,
            description:normalizedDescription,
            ownerId: req.user.userId
        })
        return res.status(201).json({
            message: "Task Created Successfully",
            data:{
                title:task.title,
                description: task.description,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create task",
            error: error.message
        })
    }
}

const getAllTask=async function(req,res){
    
}
export {
    createTask
}