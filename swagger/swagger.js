const swaggerJSDoc = require("swagger-jsdoc");

// options for the swagger docs
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "Task Manager API Information",
      contact: {
        name: "Harsh Kumar",
        github: "https://github.com/harshu6397",
      },
      servers: ["http://localhost:3000"],
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
  },
  apis: ["./routes/**/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
 