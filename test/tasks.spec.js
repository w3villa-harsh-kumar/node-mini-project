const chai = require("chai");
const chaiHttp = require("chai-http");

const app = require("../index");
const Task = require("../models/task.model");
const { StatusCodes } = require("http-status-codes");

chai.use(chaiHttp);
chai.should();

const testToken = process.env.TEST_TOKEN;

describe("++++++++++++++ Tasks APIs Unit Testing ++++++++++++++", () => {
    describe("POST /api/v1/tasks", () => {
        it("It should create a new task", (done) => {
            const task = {
                title: "Task 1",
                description: "Task 1 description",
            };
            chai.request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("msg")
                        .eql("Task created successfully");
                    res.body.task.should.have.property("title").eql("Task 1");
                    res.body.task.should.have
                        .property("description")
                        .eql("Task 1 description");
                    res.body.task.should.have.property("completed").eql(false);
                    res.body.task.should.have.property("owner");
                    done();
                });
        });

        it("It should not create a task without a token", (done) => {
            const task = {
                title: "Task 1",
                description: "Task 1 description",
            };
            chai.request(app)
                .post("/api/v1/tasks")
                .send(task)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNAUTHORIZED);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("msg")
                        .eql("Not authorized to access this route");
                    done();
                });
        });

        it("It should not create a task with empty title", (done) => {
            const task = {
                title: "",
                description: "Task 1 description",
            };
            chai.request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("msg")
                        .eql("Title cannot be an empty field");
                    done();
                });
        });

        it("It should not create a task with empty description", (done) => {
            const task = {
                title: "Task 1",
                description: "",
            };
            chai.request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("msg")
                        .eql("Description cannot be an empty field");
                    done();
                });
        });

        it("It should not create a task with empty title and description", (done) => {
            const task = {
                title: "",
                description: "",
            };
            chai.request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("msg")
                        .eql("Title cannot be an empty field");
                    done();
                });
        });

        it("It should not create a task with title less than 3 characters", (done) => {
            const task = {
                title: "Ta",
                description: "Task 1 description",
            };
            chai.request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("msg")
                        .eql("Title should have a minimum length of 3");
                    done();
                });
        });

        it("It should not create a task with description less than 5 characters", (done) => {
            const task = {
                title: "Task 1",
                description: "Task",
            };
            chai.request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("msg")
                        .eql("Description should have a minimum length of 5");
                    done();
                });
        });

        it("It should not create a task with title more than 20 characters", (done) => {
            const task = {
                title: "Task 1 Task 1 Task 1 Task 1 Task 1",
                description: "Task 1 description",
            };
            chai.request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("msg")
                        .eql("Title should have a maximum length of 20");
                    done();
                });
        });

        it("It should not create a task with description more than StatusCodes.OK characters", (done) => {
            const task = {
                title: "Task 1",
                description:
                    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit nam, facere sit iste saepe ipsam harum iure exercitationem numquam! Cumque similique reiciendis beatae? Ab illum, consectetur sunt omnis molestiae nulla voluptatibus. Soluta officiis obcaecati repellendus sapiente mollitia, nam incidunt consectetur tempore laudantium beatae necessitatibus, quo blanditiis iure, voluptas amet modi sit distinctio inventore possimus enim molestias numquam aspernatur eius quas. Doloribus laboriosam harum animi quisquam, nisi optio numquam ut beatae hic consequatur veniam atque ab id et dolores aut sunt alias vitae quasi error vel? Dolorum, laboriosam reprehenderit. Aperiam beatae dolorum assumenda magnam ullam iusto placeat eius hic quasi deserunt. Hello",
            };

            chai.request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("msg")
                        .eql("Description should have a maximum length of 100");
                    done();
                });
        });
    });

    describe("GET /api/v1/tasks", () => {
        it("It should return all tasks", (done) => {
            chai.request(app)
                .get("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    res.body.should.be.a("object");
                    res.body.tasks.should.be.a("array");
                    done();
                });
        });

        it("It should not return all tasks without token", (done) => {
            chai.request(app)
                .get("/api/v1/tasks")
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNAUTHORIZED);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("msg")
                        .eql("Not authorized to access this route");
                    done();
                });
        });

        it("It should filter the tasks by completed status true", (done) => {
            chai.request(app)
                .get("/api/v1/tasks?completed=true")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    res.body.tasks.should.be.a("array");
                    res.body.tasks.length.should.be.eq(0);
                    done();
                });
        });

        it("It should filter the tasks by completed status false", (done) => {
            chai.request(app)
                .get("/api/v1/tasks?completed=false")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    res.body.tasks.should.be.a("array");
                    res.body.tasks.length.should.be.eq(1);
                    done();
                });
        });

        it("It should filter the tasks by completed status false and title", (done) => {
            chai.request(app)
                .get("/api/v1/tasks?completed=false&title=Task 1")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    res.body.tasks.should.be.a("array");
                    res.body.tasks.length.should.be.eq(1);
                    done();
                });
        });

        it("It should filter the tasks by completed status false and title", (done) => {
            chai.request(app)
                .get("/api/v1/tasks?completed=false&title=Task 2")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    res.body.tasks.should.be.a("array");
                    res.body.tasks.length.should.be.eq(0);
                    done();
                });
        });

        it("It should filter the tasks by fields", (done) => {
            chai.request(app)
                .get("/api/v1/tasks?fields=title,description")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    res.body.tasks.should.be.a("array");
                    res.body.tasks.length.should.be.eq(1);
                    res.body.tasks[0].should.have.property("title");
                    res.body.tasks[0].should.have.property("description");
                    res.body.tasks[0].should.not.have.property("completed");
                    done();
                });
        });

        it("It should filter the tasks by fields and completed status", (done) => {
            chai.request(app)
                .get("/api/v1/tasks?fields=title,description&completed=true")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    res.body.tasks.should.be.a("array");
                    res.body.tasks.length.should.be.eq(0);
                    done();
                });
        });

        it("It should filter the tasks by fields and completed status", (done) => {
            chai.request(app)
                .get("/api/v1/tasks?fields=title,description&completed=false")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    res.body.tasks.should.be.a("array");
                    res.body.tasks.length.should.be.eq(1);
                    res.body.tasks[0].should.have.property("title");
                    res.body.tasks[0].should.have.property("description");
                    res.body.tasks[0].should.not.have.property("completed");
                    done();
                });
        });

        it("It should filter the tasks by fields and title", (done) => {
            chai.request(app)
                .get("/api/v1/tasks?fields=title,description&title=Task 1")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    res.body.tasks.should.be.a("array");
                    res.body.tasks.length.should.be.eq(1);
                    res.body.tasks[0].should.have.property("title");
                    res.body.tasks[0].should.have.property("description");
                    res.body.tasks[0].should.not.have.property("completed");
                    done();
                });
        });

        it("It should sort the tasks by title ascending", (done) => {
            chai.request(app)
                .get("/api/v1/tasks?sort=title")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    const tasks = res.body.tasks;
                    tasks.should.be.a("array");
                    tasks.length.should.be.eq(1);
                    tasks[0].should.have.property("title").eql("Task 1");
                    done();
                });
        });

        it("It should sort the tasks by title descending", (done) => {
            chai.request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .send({
                    title: "Task",
                    description: "Task 2 description",
                    completed: false,
                })
                .end((err, res) => {
                    chai.request(app)
                        .get("/api/v1/tasks?sort=-title")
                        .set("Authorization", `Bearer ${testToken}`)
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.OK);
                            const tasks = res.body.tasks;
                            tasks.should.be.a("array");
                            tasks.length.should.be.eq(2);
                            tasks[0].should.have
                                .property("title")
                                .eql("Task 1");
                            done();
                        });
                });
        });

        it("It should paginate the tasks", (done) => {
            chai.request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .send({
                    title: "Task 2",
                    description: "Task 2 description",
                })
                .end((err, res) => {
                    chai.request(app)
                        .get("/api/v1/tasks?page=1&limit=1")
                        .set("Authorization", `Bearer ${testToken}`)
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.OK);
                            const tasks = res.body.tasks;
                            tasks.should.be.a("array");
                            tasks.length.should.be.eq(1);
                            res.body.should.have.property("totalPages").eql(3);
                            res.body.should.have.property("currentPage").eql(1);
                            done();
                        });
                });
        });

        it("It should paginate the tasks with default values", (done) => {
            chai.request(app)
                .post("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .send({
                    title: "Task 2",
                    description: "Task 2 description",
                })
                .end((err, res) => {
                    chai.request(app)
                        .get("/api/v1/tasks")
                        .set("Authorization", `Bearer ${testToken}`)
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.OK);
                            const tasks = res.body.tasks;
                            tasks.should.be.a("array");
                            tasks.length.should.be.eq(4);
                            res.body.should.have.property("totalPages").eql(1);
                            res.body.should.have.property("currentPage").eql(1);
                            done();
                        });
                });
        });

        it("It should paginate the tasks with invalid page and limit values and return default all the tasks", (done) => {
            chai.request(app)
                .get("/api/v1/tasks?page=invalid&limit=invalid")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    const tasks = res.body.tasks;
                    tasks.should.be.a("array");
                    tasks.length.should.be.eq(4);
                    res.body.should.have.property("totalPages").eql(1);
                    res.body.should.have.property("currentPage").eql(1);
                    done();
                });
        });
    });

    // Test the GET (by id) route
    describe("GET /api/v1/tasks/:id", () => {
        it("It should GET a task by ID", (done) => {
            chai.request(app)
                .get("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    const taskId = res.body.tasks[0]._id;
                    chai.request(app)
                        .get(`/api/v1/tasks/${taskId}`)
                        .set("Authorization", `Bearer ${testToken}`)
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.OK);
                            res.body.task.should.have.property("title");
                            res.body.task.should.have.property("description");
                            res.body.task.should.have.property("completed");
                            res.body.task.should.have
                                .property("_id")
                                .eq(taskId);
                            res.body.should.have
                                .property("msg")
                                .eql("Task is retrieved successfully");
                            done();
                        });
                });
        });

        it("It should NOT GET a task by invalid ID", (done) => {
            const taskId = "invalid";
            chai.request(app)
                .get(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    res.body.should.have
                        .property("msg")
                        .eql("Id should be a valid mongo id");
                    done();
                });
        });

        it("It should NOT GET a task with non-existing ID", (done) => {
            const taskId = "5f3d1c4a1c9d4StatusCodes.BAD_REQUEST00000000";
            chai.request(app)
                .get(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have
                        .property("msg")
                        .eql("No task found with id: 5f3d1c4a1c9d4StatusCodes.BAD_REQUEST00000000");
                    done();
                });
        });

        it("It should NOT GET a task without token", (done) => {
            const taskId = "5f3d1c4a1c9d4StatusCodes.BAD_REQUEST00000000";
            chai.request(app)
                .get(`/api/v1/tasks/${taskId}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNAUTHORIZED);
                    res.body.should.have
                        .property("msg")
                        .eql("Not authorized to access this route");
                    done();
                });
        });

        it("It should NOT GET a task with invalid token", (done) => {
            const taskId = "5f3d1c4a1c9d4StatusCodes.BAD_REQUEST00000000";
            chai.request(app)
                .get(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${testToken}invalid`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNAUTHORIZED);
                    res.body.should.have
                        .property("msg")
                        .eql("Not authorized to access this route");
                    done();
                });
        });
    });

    describe("PUT /api/v1/tasks/:id", () => {
        it("It should PUT an existing task", (done) => {
            chai.request(app)
                .get("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    const taskId = res.body.tasks[0]._id;
                    chai.request(app)
                        .patch(`/api/v1/tasks/${taskId}`)
                        .set("Authorization", `Bearer ${testToken}`)
                        .send({
                            title: "Task 1 updated",
                            completed: true,
                        })
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.OK);
                            res.body.task.should.have.property("title");
                            res.body.task.should.have.property("description");
                            res.body.task.should.have.property("completed");
                            res.body.task.should.have
                                .property("_id")
                                .eq(taskId);
                            res.body.should.have
                                .property("msg")
                                .eql("Task is updated successfully");
                            done();
                        });
                });
        });

        it("It should NOT PUT a task with invalid ID", (done) => {
            const taskId = "invalid";
            chai.request(app)
                .patch(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${testToken}`)
                .send({
                    title: "Task 1 updated",
                    completed: true,
                })
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    res.body.should.have
                        .property("msg")
                        .eql("Id should be a valid mongo id");
                    done();
                });
        });

        it("It should NOT PUT a task with non-existing ID", (done) => {
            const taskId = "5f3d1c4a1c9d4StatusCodes.BAD_REQUEST00000000";
            chai.request(app)
                .patch(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${testToken}`)
                .send({
                    title: "Task 1 updated",
                    completed: true,
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have
                        .property("msg")
                        .eql("No task found with id: 5f3d1c4a1c9d4StatusCodes.BAD_REQUEST00000000");
                    done();
                });
        });

        it("It should NOT PUT a task without token", (done) => {
            const taskId = "5f3d1c4a1c9d4StatusCodes.BAD_REQUEST00000000";
            chai.request(app)
                .patch(`/api/v1/tasks/${taskId}`)
                .send({
                    title: "Task 1 updated",
                    completed: true,
                })
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNAUTHORIZED);
                    res.body.should.have
                        .property("msg")
                        .eql("Not authorized to access this route");
                    done();
                });
        });

        it("It should NOT PUT a task with invalid token", (done) => {
            const taskId = "5f3d1c4a1c9d4StatusCodes.BAD_REQUEST00000000";
            chai.request(app)
                .patch(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${testToken}invalid`)
                .send({
                    title: "Task 1 updated",
                    completed: true,
                })
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNAUTHORIZED);
                    res.body.should.have
                        .property("msg")
                        .eql("Not authorized to access this route");
                    done();
                });
        });
    });

    describe("DELETE /api/v1/tasks/:id", () => {
        it("It should DELETE an existing task", (done) => {
            chai.request(app)
                .get("/api/v1/tasks")
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    const taskId = res.body.tasks[0]._id;
                    chai.request(app)
                        .delete(`/api/v1/tasks/${taskId}`)
                        .set("Authorization", `Bearer ${testToken}`)
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.OK);
                            res.body.should.have
                                .property("msg")
                                .eql("Task is deleted successfully");
                            done();
                        });
                });
        });

        it("It should NOT DELETE a task with invalid ID", (done) => {
            const taskId = "invalid";
            chai.request(app)
                .delete(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    res.body.should.have
                        .property("msg")
                        .eql("Id should be a valid mongo id");
                    done();
                });
        });

        it("It should NOT DELETE a task with non-existing ID", (done) => {
            const taskId = "5f3d1c4a1c9d4StatusCodes.BAD_REQUEST00000000";
            chai.request(app)
                .delete(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${testToken}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have
                        .property("msg")
                        .eql("No task found with id: 5f3d1c4a1c9d4StatusCodes.BAD_REQUEST00000000");
                    done();
                });
        });

        it("It should NOT DELETE a task without token", (done) => {
            const taskId = "5f3d1c4a1c9d4StatusCodes.BAD_REQUEST00000000";
            chai.request(app)
                .delete(`/api/v1/tasks/${taskId}`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNAUTHORIZED);
                    res.body.should.have
                        .property("msg")
                        .eql("Not authorized to access this route");
                    done();
                });
        });

        it("It should NOT DELETE a task with invalid token", (done) => {
            const taskId = "5f3d1c4a1c9d4StatusCodes.BAD_REQUEST00000000";
            chai.request(app)
                .delete(`/api/v1/tasks/${taskId}`)
                .set("Authorization", `Bearer ${testToken}invalid`)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNAUTHORIZED);
                    res.body.should.have
                        .property("msg")
                        .eql("Not authorized to access this route");
                    done();
                });
        });
    });

    // Drop the user after the test is done
    after((done) => {
        Task.collection
            .drop()
            .then(() => done())
            .catch((err) => done(err));
    });
});
