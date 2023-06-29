const Task = require("../../models/task.model");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../../errors");

module.exports = {
    createTask: async (req, res, next) => {
        try {
            /**
                #swagger.summary = 'Create a new task'
                #swagger.tags = ['Task']
                #swagger.description = 'Endpoint to create a task'
                #swagger.parameters['obj'] = {
                    in: 'body',
                    description: 'Task information.',
                    required: true,
                    type: 'object',
                    schema: { $ref: "#/definitions/Task" }
                }
             */

            // Create a new task for the logged in user
            const task = await Task.create({
                ...req.body,
                owner: req.user._id,
            });

            // Check if task is created
            /*
                #swagger.responses[400] = {
                    schema: { $ref: "#/definitions/BadRequest" },
                    description: 'Bad request'
                }
            */
            if (!task) {
                throw new BadRequestError("Task could not be created");
            }

            // Send response
            /*
                #swagger.responses[201] = {
                    schema: { $ref: "#/definitions/TaskResponse" },
                    description: 'Task created successfully'
                }
            */
            res.status(StatusCodes.CREATED).json({
                task,
                success: true,
                msg: "Task created successfully",
            });
        } catch (err) {
            /*
                #swagger.responses[500] = {
                    schema: { $ref: "#/definitions/InternalServerError" },
                    description: 'Server error'
                }
            */
            return next(err);
        }
    },

    getAllTasks: async (req, res, next) => {
        try {
            /*
                #swagger.summary = 'Get all tasks'
                #swagger.tags = ['Task']
                #swagger.description = 'Endpoint to get all tasks'
            */

            // Get all tasks for the logged in user
            const { completed, title, sort, fields } = req.query;
            const queryObj = { owner: req.user._id };

            // filter by completed status
            if (completed) {
                queryObj.completed = completed === "true" ? true : false;
            }

            // filter by title (case insensitive)
            if (title) {
                queryObj.title = { $regex: title, $options: "i" };
            }

            let tempTask = Task.find(queryObj);
            // filter fields
            if (fields) {
                const fieldsList = fields.split(",").join(" ");
                tempTask = tempTask.select(fieldsList);
            }

            // sort tasks
            if (sort) {
                const sortList = sort.split(",").join(" ");
                tempTask = tempTask.sort(sortList);
            } else {
                tempTask = tempTask.sort("createdAt");
            }

            // pagination
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // calculate the total number of pages
            const total = await Task.countDocuments(queryObj);
            const pages = Math.ceil(total / limit);

            // apply pagination
            tempTask = tempTask.skip(skip).limit(limit);

            // execute query
            const tasks = await tempTask;

            // Send response
            /*
                #swagger.responses[200] = {
                    schema: { $ref: "#/definitions/TasksResponse" },
                    description: 'All tasks retrieved successfully'
                } 
            */
            res.status(StatusCodes.OK).json({
                success: true,
                tasks,
                count: tasks.length,
                page,
                totalPages: pages,
                msg: "All tasks retrieved successfully",
            });
        } catch (err) {
            /*
                #swagger.responses[500] = {
                    schema: { $ref: "#/definitions/InternalServerError" },
                    description: 'Server error'
                }
            */
            return next(err);
        }
    },

    getTask: async (req, res, next) => {
        try {
            /*
                #swagger.summary = 'Get a task by id'
                #swagger.tags = ['Task']
                #swagger.description = 'Endpoint to get a task'
                #swagger.parameters['id'] = {
                    in: 'path',
                    description: 'Task id.',
                    required: true,
                    type: 'string'
                }
            */
            const { id: taskId } = req.params;

            // Get task by id for the logged in user
            const task = await Task.findOne({
                _id: taskId,
                owner: req.user._id,
            });

            // Check if task is retrieved
            /*
                #swagger.responses[404] = {
                    schema: { $ref: "#/definitions/NotFound" },
                    description: 'Task not found'
                }
            */
            if (!task) {
                throw new NotFoundError(`No task found with id: ${taskId}`);
            }

            // Send response
            /*
                #swagger.responses[200] = {
                    schema: { $ref: "#/definitions/TaskResponse" },
                    description: 'Task retrieved successfully'
                }
            */
            res.status(StatusCodes.OK).json({
                success: true,
                task,
                msg: `Task is retrieved successfully`,
            });
        } catch (err) {
            /*
                #swagger.responses[500] = {
                    schema: { $ref: "#/definitions/InternalServerError" },
                    description: 'Server error'
                }
            */
            return next(err);
        }
    },

    updateTask: async (req, res, next) => {
        try {
            /*
                #swagger.summary = 'Update a task by id'
                #swagger.tags = ['Task']
                #swagger.description = 'Endpoint to update a task'
                #swagger.parameters['id'] = {
                    in: 'path',
                    description: 'Task id.',
                    required: true,
                    type: 'string'
                }
                #swagger.parameters['obj'] = {
                    in: 'body',
                    description: 'Task information.',
                    required: true,
                    type: 'object',
                    schema: { $ref: "#/definitions/UpdateTask" }
                }
            */
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
            /*
                #swagger.responses[404] = {
                    schema: { $ref: "#/definitions/NotFound" },
                    description: 'Task not found'
                }
            */
            if (!updatedTask) {
                throw new NotFoundError(`No task found with id: ${taskId}`);
            }

            // Send response
            /*
                #swagger.responses[200] = {
                    schema: { $ref: "#/definitions/TaskResponse" },
                    description: 'Task updated successfully'
                }
            */
            res.status(StatusCodes.OK).json({
                success: true,
                updatedTask,
                msg: `Task is updated successfully`,
            });
        } catch (err) {
            /*
                #swagger.responses[500] = {
                    schema: { $ref: "#/definitions/InternalServerError" },
                    description: 'Server error'
                }
            */
            return next(err);
        }
    },

    deleteTask: async (req, res, next) => {
        try {
            /*
                #swagger.summary = 'Delete a task by id'
                #swagger.tags = ['Task']
                #swagger.description = 'Endpoint to delete a task'
                #swagger.parameters['id'] = {
                    in: 'path',
                    description: 'Task id.',
                    required: true,
                    type: 'string'
                }
            */
            const { id: taskId } = req.params;

            // Delete task by id for the logged in user
            const task = await Task.findOneAndDelete({
                _id: taskId,
                owner: req.user._id,
            });

            // Check if task is deleted
            /*
                #swagger.responses[404] = {
                    schema: { $ref: "#/definitions/NotFound" },
                    description: 'Task not found'
                }
            */
            if (!task) {
                throw new NotFoundError(`No task found with id: ${taskId}`);
            }

            // Send response
            /*
                #swagger.responses[200] = {
                    schema: { $ref: "#/definitions/SuccessResponse" },
                    description: 'Task deleted successfully'
                }
            */
            res.status(StatusCodes.OK).json({
                success: true,
                msg: `Task is deleted successfully`,
            });
        } catch (err) {
            /*
                #swagger.responses[500] = {
                    schema: { $ref: "#/definitions/InternalServerError" },
                    description: 'Server error'
                }
            */
            return next(err);
        }
    },
};
