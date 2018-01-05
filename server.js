//Dependencies------------------------------------------------------------------------------
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");

var PORT = 8080;

// Initialize Express
var app = express();

// Configure middleware-----------------------------------------------------------------------

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in Promises && Connect to Mongo DB---------------------------
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/webscraperTest", {
    useMongoClient: true
});
mongoose.set('debug', true);

// Routes--------------------------------------------------------------------------------------

// A GET route for scraping the echojs website
var routes = require("./controllers/controller.js");
app.use("/", routes);


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});