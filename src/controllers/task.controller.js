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
        limit = Math.min(parseInt(limit) || 2, 100)
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
            success: true,
            data: {
                tasks,
                pagination: {
                    totalItems: totalTasks,
                    currentPage: page,
                    totalPages: Math.ceil(totalTasks / limit),
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

const getSingleTask = async function (req, res) {
    try {
        const {
            id
        } = req.params;
        const task = await Task.findOne({
            _id: id,
            ownerId: req.user.userId
        }).select(
            "title description createdAt updatedAt"
        )
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }
        return res.status(200).json({
            success: true,
            data: task
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get task",
            error: error.message
        })
    }
}

const updateTask = async function (req, res) {
    try {
        const {
            id
        } = req.params;
        const {
            title,
            description
        } = req.body || {};
        if(title===undefined && description===undefined){
            return res.status(400).json({
                message: "No valid fields are provided to update"
            })
        }
        console.log("description: ", typeof description)
        let normalizedTitle;
        if (title !==undefined) {
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
            normalizedTitle = title.trim();
        }
        
        let normalizedDescription;
        if(description !==undefined){
        normalizedDescription = typeof description === 'string' ? description.trim() : "";
        normalizedDescription=description.trim();
        }
        
        const task = await Task.findOneAndUpdate({
            _id: id,
            ownerId: req.user.userId
        }, {
            ...(normalizedTitle!==undefined && {title:normalizedTitle}),
            ...(normalizedDescription!==undefined && {description:normalizedDescription})
        }, {
            new: true
        }).select(
            "title description createdAt updatedAt"
        )
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update task",
            error: error.message
        })
    }
}
export {
    createTask,
    getAllTask,
    getSingleTask,
    updateTask
}