const chai = require("chai");
const chaiHttp = require("chai-http");
const { StatusCodes } = require("http-status-codes");

const app = require("../index");
const User = require("../models/user.model");
const { resetPassword } = require("../controllers/v1/users.controller");

chai.use(chaiHttp);
chai.should();

describe("+++++++++++++ Users APIs Unit Testing +++++++++++++", () => {
    describe("Register a new user", () => {
        it("Should register a new user", (done) => {
            const user = {
                name: "test",
                email: "test@gmail.com",
                password: "test1234",
                phoneNumber: "1234567890",
            };

            chai.request(app)
                .post("/api/v1/users/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.CREATED);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eq(true);
                    res.body.should.have.property("token");
                    done();
                });
        });

        it("Should return error if email is already registered", (done) => {
            const user = {
                email: "test@gmail.com",
                name: "test",
                password: "test1234",
                phoneNumber: "1234567890",
            };

            chai.request(app)
                .post("/api/v1/users/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.BAD_REQUEST);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eq(false);
                    res.body.should.have.property("msg");
                    done();
                });
        });

        it("It should NOT register a new user without the name property", (done) => {
            const user = {
                email: "test@gmail.com",
                password: "test1234",
                phoneNumber: "1234567890",
            };
            chai.request(app)
                .post("/api/v1/users/register")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(
                        StatusCodes.UNPROCESSABLE_ENTITY
                    );
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Name is a required field");
                    done();
                });
        });

        it("It should NOT register a new user without the email property", (done) => {
            const user = {
                name: "test",
                password: "test1234",
                phoneNumber: "1234567890",
            };
            chai.request(app)
                .post("/api/v1/users/register")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(
                        StatusCodes.UNPROCESSABLE_ENTITY
                    );
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Email is a required field");
                    done();
                });
        });

        it("It should NOT register a new user without the password property", (done) => {
            const user = {
                name: "test",
                email: "test@gmail.com",
                phoneNumber: "1234567890",
            };
            chai.request(app)
                .post("/api/v1/users/register")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(
                        StatusCodes.UNPROCESSABLE_ENTITY
                    );
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Password is a required field");
                    done();
                });
        });

        it("It should NOT register a new user without the phoneNumber property", (done) => {
            const user = {
                name: "test",
                email: "test@gmail.com",
                password: "test1234",
            };
            chai.request(app)
                .post("/api/v1/users/register")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(
                        StatusCodes.UNPROCESSABLE_ENTITY
                    );
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Phone Number is a required field");
                    done();
                });
        });

        it("It should NOT register a new user with an invalid email", (done) => {
            const user = {
                name: "test",
                email: "testgmail.com",
                password: "test1234",
                phoneNumber: "1234567890",
            };
            chai.request(app)
                .post("/api/v1/users/register")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(
                        StatusCodes.UNPROCESSABLE_ENTITY
                    );
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Email must be a valid email");
                    done();
                });
        });

        it("It should NOT register a new user with an invalid phone number", (done) => {
            const user = {
                name: "test",
                email: "test@gmail.com",
                password: "test1234",
                phoneNumber: "123456789",
            };
            chai.request(app)
                .post("/api/v1/users/register")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(
                        StatusCodes.UNPROCESSABLE_ENTITY
                    );
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Phone Number must contain only numbers");
                    done();
                });
        });
    });

    describe("Login a user", () => {
        it("Should login a user", (done) => {
            const user = {
                email: "test@gmail.com",
                password: "test1234",
            };

            chai.request(app)
                .post("/api/v1/users/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eq(true);
                    res.body.should.have.property("token");
                    done();
                });
        });

        it("It should NOT login a user without the email property", (done) => {
            const user = {
                password: "test1234",
            };
            chai.request(app)
                .post("/api/v1/users/login")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Email is a required field");
                    done();
                });
        });

        it("It should NOT login a user without the password property", (done) => {
            const user = {
                email: "test@gmail.com",
            };
            chai.request(app)
                .post("/api/v1/users/login")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Password is a required field");
                    done();
                });
        });

        it("It should NOT login a user with an invalid email", (done) => {
            const user = {
                email: "testgmail.com",
                password: "test1234",
            };
            chai.request(app)
                .post("/api/v1/users/login")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Email must be a valid email");
                    done();
                });
        });

        it("It should NOT login a user with an invalid password", (done) => {
            const user = {
                email: "test@gmail.com",
                password: "testuser",
            };
            chai.request(app)
                .post("/api/v1/users/login")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(StatusCodes.BAD_REQUEST);
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Invalid credentials");
                    done();
                });
        });

        it("It should NOT login a user that does not exist", (done) => {
            const user = {
                email: "my@gmail.com",
                password: "test1234",
            };
            chai.request(app)
                .post("/api/v1/users/login")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(StatusCodes.BAD_REQUEST);
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Invalid credentials");
                    done();
                });
        });
    });

    describe("Get User Profile", () => {
        it("It should get the profile of the user", (done) => {
            chai.request(app)
                .post("/api/v1/users/login")
                .send({
                    email: "test@gmail.com",
                    password: "test1234",
                })
                .end((err, res) => {
                    console.log(res.body);
                    chai.request(app)
                        .get("/api/v1/users/profile")
                        .set("Authorization", `Bearer ${res.body.token}`)
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.OK);
                            res.body.should.be.a("object");
                            res.body.should.have.property("user");
                            res.body.user.should.have.property("_id");
                            res.body.user.should.have.property("name");
                            res.body.user.should.have.property("email");
                            res.body.user.should.have.property("createdAt");
                            res.body.user.should.have.property("updatedAt");
                            done();
                        });
                });
        });

        it("It should NOT get the profile of the user without a token", (done) => {
            chai.request(app)
                .get("/api/v1/users/profile")
                .end((err, res) => {
                    res.should.have.status(StatusCodes.UNAUTHORIZED);
                    res.body.should.be.a("object");
                    res.body.should.have
                        .property("msg")
                        .eq("Not authorized to access this route");
                    done();
                });
        });

        it("It should NOT get the profile of the user with an invalid token", (done) => {
            chai.request(app)
                .post("/api/v1/users/login")
                .send({
                    email: "test@gmail.com",
                    password: "test1234",
                })
                .end((err, res) => {
                    chai.request(app)
                        .get("/api/v1/users/profile")
                        .set("Authorization", `Bearer ${res.body.token}1`)
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.UNAUTHORIZED);
                            res.body.should.be.a("object");
                            res.body.should.have
                                .property("msg")
                                .eq("Not authorized to access this route");
                            done();
                        });
                });
        });

        it("It should NOT send the password in the response", (done) => {
            chai.request(app)
                .post("/api/v1/users/login")
                .send({
                    email: "test@gmail.com",
                    password: "test1234",
                })
                .end((err, res) => {
                    chai.request(app)
                        .get("/api/v1/users/profile")
                        .set("Authorization", `Bearer ${res.body.token}`)
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.OK);
                            res.body.should.be.a("object");
                            res.body.should.have.property("user");
                            res.body.user.should.have.property("_id");
                            res.body.user.should.have.property("name");
                            res.body.user.should.have.property("email");
                            res.body.user.should.have.property("createdAt");
                            res.body.user.should.have.property("updatedAt");
                            res.body.user.should.not.have.property("password");
                            done();
                        });
                });
        });
    });

    describe("Forget password", () => {
        it("Should send a reset password token to the user", (done) => {
            const user = {
                email: "test@gmail.com",
            };

            chai.request(app)
                .post("/api/v1/users/forget-password")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(StatusCodes.OK);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eq(true);
                    res.body.should.have
                        .property("msg")
                        .eq("Here is your onetime token to reset password");
                    res.body.should.have.property("token");
                    done();
                });
        });

        it("It should NOT send a reset password token to the user without the email property", (done) => {
            const user = {};
            chai.request(app)
                .post("/api/v1/users/forget-password")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Email is a required field");
                    done();
                });
        });

        it("It should NOT send a reset password token to the user with an invalid email", (done) => {
            const user = {
                email: "testgmail.com",
            };
            chai.request(app)
                .post("/api/v1/users/forget-password")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("Email must be a valid email");
                    done();
                });
        });

        it("It should NOT send a reset password token to the user that does not exist", (done) => {
            const user = {
                email: "harsh@gmail.com",
            };
            chai.request(app)
                .post("/api/v1/users/forget-password")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a("object");
                    response.body.should.have
                        .property("msg")
                        .eq("User does not exist");
                    done();
                });
        });

        it("It should not send the new token for reset password to a user if he already has one", (done) => {
            const user = {
                email: "test@gmail.com",
            };
            chai.request(app)
                .post("/api/v1/users/forget-password")
                .send(user)
                .end((err, response) => {
                    response.should.have.status(StatusCodes.OK);
                    response.body.should.be.a("object");
                    response.body.should.have.property("success").eq(true);
                    response.body.should.have
                        .property("msg")
                        .eq("you already have a token to reset password");
                    response.body.should.have.property("token");
                    done();
                });
        });
    });

    describe("Reset password", () => {
        it("Should reset the password of the user", (done) => {
            chai.request(app)
                .post("/api/v1/users/forget-password")
                .send({
                    email: "test@gmail.com",
                })
                .end((err, res) => {
                    chai.request(app)
                        .post("/api/v1/users/reset-password")
                        .send({
                            password: "test12345",
                            confirmPassword: "test12345",
                            token: res.body.token,
                        })
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.OK);
                            res.body.should.be.a("object");
                            res.body.should.have.property("success").eq(true);
                            res.body.should.have
                                .property("msg")
                                .eq("Password reset successfully");
                            done();
                        });
                });
        });

        it("It should NOT reset the password of the user without the token property", (done) => {
            chai.request(app)
                .post("/api/v1/users/forget-password")
                .send({
                    email: "test@gmail.com",
                })
                .end((err, res) => {
                    chai.request(app)
                        .post("/api/v1/users/reset-password")
                        .send({
                            password: "test12345",
                            confirmPassword: "test12345",
                        })
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                            res.body.should.be.a("object");
                            res.body.should.have
                                .property("msg")
                                .eq("Token is a required field");
                            done();
                        });
                });
        });

        it("It should NOT reset the password of the user without the password property", (done) => {
            chai.request(app)
                .post("/api/v1/users/forget-password")
                .send({
                    email: "test@gmail.com",
                })
                .end((err, res) => {
                    chai.request(app)
                        .post("/api/v1/users/reset-password")
                        .send({
                            confirmPassword: "test12345",
                            token: res.body.token,
                        })
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                            res.body.should.be.a("object");
                            res.body.should.have
                                .property("msg")
                                .eq("New password is a required field");
                            done();
                        });
                });
        });

        it("It should NOT reset the password of the user without the confirmPassword property", (done) => {
            chai.request(app)
                .post("/api/v1/users/forget-password")
                .send({
                    email: "test@gmail.com",
                })
                .end((err, res) => {
                    chai.request(app)
                        .post("/api/v1/users/reset-password")
                        .send({
                            password: "test12345",
                            token: res.body.token,
                        })
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                            res.body.should.be.a("object");
                            res.body.should.have
                                .property("msg")
                                .eq("Confirm Password is a required field");
                            done();
                        });
                });
        });

        it("It should NOT reset the password of the user with an invalid token", (done) => {
            chai.request(app)
                .post("/api/v1/users/forget-password")
                .send({
                    email: "test@gmail.com",
                })
                .end((err, res) => {
                    console.log(res.body);
                    chai.request(app)
                        .post("/api/v1/users/reset-password")
                        .send({
                            password: "test12345",
                            confirmPassword: "test12345",
                            token: res.body.token + "1",
                        })
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                            res.body.should.be.a("object");
                            res.body.should.have
                                .property("msg")
                                .eq("Token must be a valid token");
                            done();
                        });
                });
        });

        it("It should NOT reset the password of the user if the password is same as the old password", (done) => {
            chai.request(app)
                .post("/api/v1/users/forget-password")
                .send({
                    email: "test@gmail.com",
                })
                .end((err, res) => {
                    chai.request(app)
                        .post("/api/v1/users/reset-password")
                        .send({
                            password: "test12345",
                            confirmPassword: "test12345",
                            token: res.body.token,
                        })
                        .end((err, res) => {
                            res.should.have.status(StatusCodes.BAD_REQUEST);
                            res.body.should.be.a("object");
                            res.body.should.have
                                .property("msg")
                                .eq("Password cannot be same as old password");
                            done();
                        });
                });
        });

        it("It should NOT reset the password of the user if the password and confirmPassword do not match", (done) => {
            chai.request(app)
                .post("/api/v1/users/forget-password")
                .send({
                    email: "test@gmail.com",
                })
                .end((err, res) => {
                    chai.request(app)
                        .post("/api/v1/users/reset-password")
                        .send({
                            password: "test12345",
                            confirmPassword: "test123456",
                            token: res.body.token,
                        })
                        .end((err, res) => {
                            res.should.have.status(
                                StatusCodes.UNPROCESSABLE_ENTITY
                            );
                            res.body.should.be.a("object");
                            res.body.should.have
                                .property("msg")
                                .eq(
                                    "Confirm Password must match with Password"
                                );
                            done();
                        });
                });
        });
    });

    // Drop the user after the test is done
    after((done) => {
        User.collection
            .drop()
            .then(() => done())
            .catch((err) => done(err));
    });
});
