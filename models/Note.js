var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
var NoteSchema = new Schema({
    body: String
});

// Create our model from the above schema
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note; // Export the Note model
