const Task = require("../../models/task.model");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../../errors");

module.exports = {
    createTask: async (req, res) => {
        // Add owner to req.body and create task
        const task = await Task.create({ ...req.body, owner: req.user._id });

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
        const task = await Task.findOne({ _id: taskId, owner: req.user._id });
        if (!task) {
            throw new NotFoundError(`No task found with id: ${taskId}`);
        }
        res.status(StatusCodes.OK).json({
            success: true,
            task,
            msg: `Task is retrieved successfully`,
        });
    },

    updateTask: async (req, res) => {
        const { id: taskId } = req.params;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, owner: req.user._id },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedTask) {
            throw new NotFoundError(`No task found with id: ${taskId}`);
        }

        res.status(StatusCodes.OK).json({
            success: true,
            updatedTask,
            msg: `Task is updated successfully`,
        });
    },

    deleteTask: async (req, res) => {
        const { id: taskId } = req.params;
        const task = await Task.findOneAndDelete({
            _id: taskId,
            owner: req.user._id,
        });

        if (!task) {
            throw new NotFoundError(`No task found with id: ${taskId}`);
        }

        res.status(StatusCodes.OK).json({
            success: true,
            msg: `Task is deleted successfully`,
        });
    },
};
