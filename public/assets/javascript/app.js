//Client-Side JavaScript------------------------------------------------------------------------

//Hide the div in the modal that will display a message if the user tries to submit a blank note
$("#noMessage").hide();

//The showModal function will append the article's note from the database to the modal body
function showModal(data) {
    $("#modalNotes").empty();
    //First, check to see if a note exists
    if (data.note) {
        //If there is a note, append the necessary values
        //Putting the delete button in a form allows us to POST  to /note/:noteID when clicking the submit button
        $("#modalNotes").append("<div class='card mod'>" +
                                    "<div class='card-block notesDiv'>" +
                                        "<form action='/note/" + data.note._id + "' method='POST'>" +
                                            "<button class='deleteNote btn btn-primary float-right del' type='submit'>" +
                                                "<i class='fa fa-times' aria-hidden='true'></i>" +
                                            "</button>" +
                                        "</form>" +
                                        data.note.body +
                                    "</div>" +
                                    "<div id='articleinfo' style='display:none'>" + data._id + "</div>" +
                                "</div>");
        // Show the modal
        $('#articleNotesModal').modal('show');
    }
    else {
        //If there is no note, append "No notes yet" and the article _id value
        $("#modalNotes").append("<div class='card mod'>" +
            "<div class='card-block notesDiv noNotesYet'>" +
            "No notes for this article yet!" +
            "</div>" +
            "<div id='articleinfo' style='display:none'>" + data._id + "</div>" +
            "</div>");
        $('#articleNotesModal').modal('show');
    }
}

//If the user clicks on the button to show article notes
$(".savedarticlenotes").on("click", function() {
    //get the article database _id
    var artID = $(this).attr("data-artid");
    //make a GET request to /article/:id
    $.ajax({
        url: "/article/" + artID,
        method: "GET"
    }).done(function(data) {
        //Once the request is complete, call the function to add the returned data to the modal before we show it
        showModal(data);
    });
});

//If the user clicks to save a new note
$("#addnote").on("click", function() {
    //get the note text and the article database _id
    var newnote = $("#textarea").val().trim();
    var artID = $("#articleinfo").text();
    //as long as the user entered something into the textarea
    if (newnote !== "") {
        //make a POST requestto /article/:id
        $.ajax({
            url: "/article/" + artID,
            method: "POST",
            data: { body: newnote }
        }).done(function() {
            //once the request is complete, reload the saved articles page (the modal will be close)
            location.assign("/saved");
        });
    }
    //if the user left the text area blank
    else {
        //show message requesting they enter a note
        $("#noMessage").show();
    }
});

$("#noArticlesHomeLink").on("click", function() {
    location.assign("/");
});
