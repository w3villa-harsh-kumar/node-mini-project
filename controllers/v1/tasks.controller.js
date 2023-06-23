const Task = require("../../models/task.model");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../../errors");

module.exports = {
    createTask: async (req, res) => {
        // Add owner to req.body and create task
        const task = await Task.create({ ...req.body, owner: req.user._id });

        // Check if task is created
        if (!task) {
            throw new BadRequestError("Task could not be created");
        }

        // Send response
        res.status(StatusCodes.CREATED).json({
            task,
            success: true,
            msg: "Task created successfully",
        });
    },

    getAllTasks: async (req, res) => {
        // Get all tasks for the logged in user
        const tasks = await Task.find({ owner: req.user._id });

        // Send response
        res.status(StatusCodes.OK).json({
            success: true,
            tasks,
            msg: "All tasks retrieved successfully",
        });
    },

    getTask: async (req, res) => {
        const { id: taskId } = req.params;

        // Get task by id for the logged in user
        const task = await Task.findOne({ _id: taskId, owner: req.user._id });
        if (!task) {
            throw new NotFoundError(`No task found with id: ${taskId}`);
        }

        // Send response
        res.status(StatusCodes.OK).json({
            success: true,
            task,
            msg: `Task is retrieved successfully`,
        });
    },

    updateTask: async (req, res) => {
        const { id: taskId } = req.params;

        // Update task by id for the logged in user
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, owner: req.user._id },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        // Check if task is updated
        if (!updatedTask) {
            throw new NotFoundError(`No task found with id: ${taskId}`);
        }

        // Send response
        res.status(StatusCodes.OK).json({
            success: true,
            updatedTask,
            msg: `Task is updated successfully`,
        });
    },

    deleteTask: async (req, res) => {
        const { id: taskId } = req.params;

        // Delete task by id for the logged in user
        const task = await Task.findOneAndDelete({
            _id: taskId,
            owner: req.user._id,
        });

        // Check if task is deleted
        if (!task) {
            throw new NotFoundError(`No task found with id: ${taskId}`);
        }

        // Send response
        res.status(StatusCodes.OK).json({
            success: true,
            msg: `Task is deleted successfully`,
        });
    },
};
