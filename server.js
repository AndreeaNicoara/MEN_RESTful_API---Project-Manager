const express = require ("express");
const mongoose = require ("mongoose");
const bodyParser = require ("body-parser");
const app = express();
const { verifyToken } = require("./validation");

//swagger dependencies
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs")

//setup swagger
const swaggerDefinition = yaml.load("./swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

//import project routes
const projectRoutes = require("./routes/project");
const authRoutes = require("./routes/auth");

require("dotenv-flow").config();

// parse request of content type JSON
app.use(bodyParser.json());

mongoose.connect
(
    process.env.DBHOST, 
    {
        useUnifiedTopology: true,
        useNewUrlParser:true
    }
).catch(error => console.log("Error connecting to MongoDB: " + error));

mongoose.connection.once("open", () => console.log("Successfully connected to MongoDB"));

//routes
app.get("/api/welcome", (req,res) => {
    res.status(200).send({message: "Welcome to the MEN RESTful API"});
})

//post, put delete -> CRUD
app.use("/api/projects", verifyToken, projectRoutes);
app.use("/api/user", authRoutes);

const PORT = process.env.PORT || 4000;

//start up server
app.listen(PORT, function(){
    console.log("Server is running on port: " + PORT);
})

module.exports = app;