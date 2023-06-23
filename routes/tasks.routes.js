const {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask,
} = require(`../controllers/${process.env.API_VERSION}/tasks.controller`);

const {
    createTaskValidations,
    updateTaskValidations,
    idParamValidations,
} = require(`../validations/tasks.validations`);

const validator = require("../middlewares/validator");
const authenticate = require("../middlewares/authenticate");

const router = require("express").Router();

// Task Routes
router.post(
    "/",
    authenticate,
    validator(createTaskValidations, "body"),
    createTask
);

router.get("/", authenticate, getAllTasks);

router.get(
    "/:id",
    authenticate,
    validator(idParamValidations, "params"),
    getTask
);

router.patch(
    "/:id",
    authenticate,
    validator(idParamValidations, "params"),
    validator(updateTaskValidations, "body"),
    updateTask
);
router.delete(
    "/:id",
    authenticate,
    validator(idParamValidations, "params"),
    deleteTask
);

module.exports = router;
