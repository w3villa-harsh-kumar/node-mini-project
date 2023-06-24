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

/**
 * @swagger
 *  paths:
 *   "/api/v1/tasks":
 *     post:
 *       summary: Create Task
 *       tags:
 *       - Task
 *       consumes:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: task
 *         description: create a new task
 *         schema:
 *           type: object
 *           required:
 *           - title
 *           - description
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *       - in: header
 *         name: Authorization
 *         description: The auth token generated from login
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *       responses:
 *         '200':
 *           description: Created
 *         '400':
 *           description: Bad Request
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal Server Error
 */

router.post(
    "/",
    authenticate,
    validator(createTaskValidations, "body"),
    createTask
);


/**
 * @swagger
 *  paths:
 *   "/api/v1/tasks":
 *     get:
 *       summary: Get All Tasks
 *       tags:
 *       - Task
 *       consumes:
 *       - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: The auth token generated from login
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *       responses:
 *         '200':
 *           description: Created
 *         '400':
 *           description: Bad Request
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal Server Error
 */

router.get("/", authenticate, getAllTasks);

/**
 * @swagger
 *  paths:
 *   "/api/v1/tasks/{id}":
 *     get:
 *       summary: Get Task by ID
 *       tags:
 *       - Task
 *       consumes:
 *       - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: The auth token generated from login
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *       - in: path
 *         name: id
 *         description: Task ID
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *       responses:
 *         '200':
 *           description: Created
 *         '400':
 *           description: Bad Request
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal Server Error
 */

router.get(
    "/:id",
    authenticate,
    validator(idParamValidations, "params"),
    getTask
);

/**
 * @swagger
 *  paths:
 *   "/api/v1/tasks/{id}":
 *     patch:
 *       summary: Update Task by ID
 *       tags:
 *       - Task
 *       consumes:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: task
 *         description: Update a task
 *         schema:
 *           type: object
 *           required:
 *           - title
 *           - description
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *       - in: header
 *         name: Authorization
 *         description: The auth token generated from login
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *       - in: path
 *         name: id
 *         description: Task ID
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *       responses:
 *         '200':
 *           description: Created
 *         '400':
 *           description: Bad Request
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal Server Error
 */

router.patch(
    "/:id",
    authenticate,
    validator(idParamValidations, "params"),
    validator(updateTaskValidations, "body"),
    updateTask
);

/**
 * @swagger
 *  paths:
 *   "/api/v1/tasks/{id}":
 *     delete:
 *       summary: Delete Task by ID
 *       tags:
 *       - Task
 *       consumes:
 *       - application/json
 *       parameters:
 *       - in: header
 *         name: Authorization
 *         description: The auth token generated from login
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *       - in: path
 *         name: id
 *         description: Task ID
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *       responses:
 *         '200':
 *           description: Created
 *         '400':
 *           description: Bad Request
 *         '401':
 *           description: Unauthorized
 *         '500':
 *           description: Internal Server Error
 */

router.delete(
    "/:id",
    authenticate,
    validator(idParamValidations, "params"),
    deleteTask
);

module.exports = router;
