const {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask,
} = require(`../controllers/v1/tasks.controller`);

const {
    createTaskValidations,
    updateTaskValidations,
    idParamValidations,
} = require(`../validations/tasks.validations`);

const validator = require("../middlewares/validator");
const authenticate = require("../middlewares/authenticate");

const router = require("express").Router();

// Task Routes

/**
 * Route for creating task
 * @route POST /api/v1/tasks
 */
router.post(
    "/",
    authenticate,
    validator(createTaskValidations, "body"),
    createTask
);

/**
 * Route for getting all tasks
 * @route GET /api/v1/tasks
 */
router.get("/", authenticate, getAllTasks);

/**
 * Route for getting task by id
 * @route GET /api/v1/tasks/:id
 */
router.get(
    "/:id",
    authenticate,
    validator(idParamValidations, "params"),
    getTask
);

/**
 * Route for updating task by id
 * @route PATCH /api/v1/tasks/:id
 */
router.patch(
    "/:id",
    authenticate,
    validator(idParamValidations, "params"),
    validator(updateTaskValidations, "body"),
    updateTask
);

/**
 * Route for deleting task by id
 * @route DELETE /api/v1/tasks/:id
 */
router.delete(
    "/:id",
    authenticate,
    validator(idParamValidations, "params"),
    deleteTask
);

module.exports = router;
