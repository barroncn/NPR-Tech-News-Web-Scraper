//ROUTES--------------------------------------------------------------------------------------------------

//require our models and express
var db = require("../models"); // require all the models files
var express = require("express"); // require the express module

// Scraping tools: Axios is a promised-based http library, similar to jQuery's Ajax method
var axios = require("axios");
var cheerio = require("cheerio");

var router = express.Router();

//The route to the homepage
router.get("/", function(req, res) {
    //All the articles from the database that are NOT saved are sorted, most recent displayed first
    db.Article
        .find({ saved: false }).sort({ created: -1 })
        .then(function(data) {
            //If there is no data sent back (no unsaved articles in the database)
            if (data.length === 0) {
                //The noResults message is rendered on the index.handlebars page
                res.render("index", { noResults: "Click the 'Scrape New Articles' button to get the latest NPR Tech News." });
            }
            else {
                //The results data is rendered on the index.handlebars page
                res.render("index", { results: data });
            }
        }).catch(function(err) {
            // If an error occurred, send it as a JSON object
            res.json(err);
        });
});

//The route to the saved articles page
router.get("/saved", function(req, res) {
    //All the articles from the database that ARE saved are sorted, most recent displayed first
    db.Article
        .find({ saved: true }).sort({ created: -1 })
        .then(function(data) {
            //If there is no data sent back (no saved articles in the database)
            if (data.length === 0) {
                //The noResults message is rendered onthe saved.handlebars page
                res.render("saved", { noResults: "There are no saved articles." });
            }
            else {
                //The results data is rendered on the saved.handlebars page
                res.render("saved", { results: data });
            }
        }).catch(function(err) {
            // If an error occurred, send it as a JSON object
            res.json(err);
        });
});

//Route to save a currently unsaved article, or unsave a currently saved article
router.post("/saved/:id", function(req, res) {
    //find the article by the ID specified in the parameters
    db.Article
        .findById(req.params.id, function(err, data) {
            if (err) { return res.status(500).end(); }
            //If the value of saved is true...
            if (data.saved) {
                //Set the saved key to false for the specified article
                db.Article.findByIdAndUpdate(req.params.id, { $set: { saved: false } }, { new: true }, function(data) {
                    //Redirect to the saved page
                    //(if the user chose to "unsave" an article, they must have been on this page)
                    res.redirect("/saved");
                });
            }
            //If the value of saved is false...
            else {
                //Sed the saved key to true for the specified article
                db.Article.findByIdAndUpdate(req.params.id, { $set: { saved: true } }, { new: true }, function(data) {
                    //Redirect to the home page
                    //(if the user chose to "save" an article, they must have been on this page)
                    res.redirect("/");
                });
            }
        });
});

//Route to scrape any new articles
router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.npr.org/sections/technology/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // Now, we grab every div within the class "item-info", and do the following:
        $("div.item-info").each(function(i, element) {
            // Set the variable result to an empty object
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
            result.link = $(this) //this will make the link key with the link text as the value
                .children("h2")
                .children("a")
                .attr("href");
            result.created = $(this) //this will make the created key with the "datatime" attribute value as the date
                .children("p")
                .children("a")
                .children("time")
                .attr("datetime");

            //Now, we need to check and see if the Article we just made already exists
            //Search the database to find an article with the same title
            db.Article.find({ title: result.title })
                .then(function(foundArticle) {
                    //If there is no article with a matching title...
                    if (foundArticle.length === 0) {
                        //Create a new Article document
                        db.Article
                            .create(result)
                            .then(function(newArticle) {
                                //console.log the new Article document
                                console.log(newArticle);
                            }).catch(function(err) {
                                //If there was an error creating the new document, console log it
                                console.log(err);
                            });
                    }
                    else {
                        //If the article already exists, console log it
                        console.log(foundArticle);
                    }
                }).catch(function(err) {
                    //If there was an error with finding a matching title, console log it
                    console.log(err);
                });
        });
        //Redirect to the home page (where all the unsaved, scraped articles will be displayed)
        res.redirect("/");
    });
});

//The route to delete a note
router.post("/note/:noteID", function(req, res) {
    //Find the Note with the given parameter ID and remove it
    db.Note
        .findByIdAndRemove(req.params.noteID, function(doc) {
            //Console log the deleted document
            console.log("Deleted document: " + doc);
            //Redirect to the saved page
            res.redirect("/saved");
        });
});

//The route for getting the Note related to a specific article
router.get("/article/:id", function(req, res) {
    // Using the id passed in the id parameter, find the corresponding article
    db.Article
        .findOne({ _id: req.params.id })
        //populate the note associated with it
        .populate("note")
        .then(function(dbArticle) {
            //Send Article with the associated note body back as a JSON object
            res.json(dbArticle);
        })
        .catch(function(err) {
            //If there was an error, send it back as a JSON object
            res.json(err);
        });
});

//Route to save a new Note
router.post("/article/:id", function(req, res) {
    //Create a new Note document with the text sent in the body of the request
    db.Note
        .create(req.body)
        .then(function(dbNote) {
            //If the note was created, find the Article with the parameter ID and update it to be associated with the Note
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            //Send updated Article back to the client as a JSON object
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If there was an error, send it as JSON data
            res.json(err);
        });

});

module.exports = router; //Export router
