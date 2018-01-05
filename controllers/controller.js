//ROUTES--------------------------------------------------------------------------------------------------

//require our models and express
var pasta = require("../models/index.js"); // require all the models files
var express = require("express"); // require the express module

// Scraping tools: Axios is a promised-based http library, similar to jQuery's Ajax method
var axios = require("axios");
var cheerio = require("cheerio");

var router = express.Router();

router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.npr.org/sections/technology/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // Now, we grab every h2 within an article tag, and do the following:
        $("div.item-info").each(function(i, element) {
            // Save an empty result object
            var result = {};

            // Fill in the result object for every element
            result.title = $(this) //this will make title key with the title text as the value
                .children("h2")
                .children("a")
                .text();
            result.summary = $(this) //this will make the summary key with the summary text as the value
                .children("p")
                .children("a")
                .text();
            result.link = $(this) //this will make the link key with thte link text as the value
                .children("h2")
                .children("a")
                .attr("href");

            console.log(result); //this console logs the result we just got
            // Create a new Article in the database using the `result` object built from scraping
            // db.Article
            //     .create(result)
            //     .then(function(dbArticle) {
            //         // Send a successful scrape message to the client
            //         res.send("Scrape Successful");
            //     })
            //     .catch(function(err) {
            //         // If an error occurred, send it to the client
            //         res.json(err);

            //     });
        });
    });
});

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
    //this is where we will use handlebars to render the page!
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
    //when the user clicks on "notes"
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {
    //when the user clicks on submit to add a note to an article
});

module.exports = router; //Export router
