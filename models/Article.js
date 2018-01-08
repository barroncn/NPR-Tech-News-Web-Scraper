var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
var ArticleSchema = new Schema({
    // `title` is required and of type String
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// This creates the model from the above schema
var Article = mongoose.model("Article", ArticleSchema);


module.exports = Article; // Export the Article model
