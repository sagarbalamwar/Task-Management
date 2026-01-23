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
        if (typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({
                error: "Title must non-empty string"
            })
        }
        if (title.trim().length > 100) {
            return res.status(400).json({
                error: "Title must be less than 100 characters."
            })
        }
        const normalizedTitle = title.trim();
        const normalizedDescription = typeof description === 'string' ? description.trim() : "";
        const taskExist = await Task.findOne({
            title: normalizedTitle,
            ownerId: req.user.userId
        });
        if (taskExist) {
            return res.status(409).json({
                error: "Task with this title already exist"
            })
        }
        const task = await Task.create({
            title: normalizedTitle,
            description: normalizedDescription,
            ownerId: req.user.userId
        })
        return res.status(201).json({
            message: "Task Created Successfully",
            data: {
                title: task.title,
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

const getAllTask = async function (req, res) {
    try {
        let {
            page,
            limit
        } = req.query;
        page = Math.max(parseInt(page) || 1, 1);
        limit = Math.min(parseInt(limit) || 10, 100)
        const skip = (page - 1) * limit;
        const [tasks, totalTasks] = await Promise.all(
            [
            await Task.find({
                ownerId: req.user.userId,
            })
            .select(
                "title description createdAt updatedAt"
            )
            .skip(skip)
            .limit(limit)
            .sort({
                createdAt: -1
            }),
            Task.countDocuments({
                ownerId: req.user.userId
            })
        ])
        return res.status(200).json({
            success:true,
            data:{
                tasks,
                pagination:{
                    totalItems:totalTasks,
                    currentPage:page,
                    totalPages:Math.ceil(totalTasks/limit),
                    limit
                }
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get all task",
            error: error.message
        })
    }
}
export {
    createTask,
    getAllTask,
}