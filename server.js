//Dependencies------------------------------------------------------------------------------
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Configure middleware-----------------------------------------------------------------------

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Handlebars
//==============================================================
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Set mongoose to leverage built in Promises && Connect to Mongo DB---------------------------
mongoose.Promise = Promise;

// If deployed, use the deployed database. Otherwise use the local webscraperHW database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webscraperHW";
mongoose.connect(MONGODB_URI, {
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
