// Grab the articles as a json

$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // create Callouts for the articles
    var calloutDIV = $("<div>")
      .addClass("callout")
      .attr("data-id", data[i]._id)
      .attr("id", data[i]._id);

    var headlineH = $("<h4>")
      .attr("data-id", data[i]._id)
      .text(data[i].headline);

    var summaryP = $("<p>")
      .addClass("summary")
      .attr("data-id", data[i]._id)
      .text(data[i].summary);

    var linkP = $("<p>").addClass("artlink");

    var linkA = $("<a>")
      .attr("href", "http://www.globalissues.org" + data[i].link)
      .text("See More");
    linkP.append(linkA);

    var savedDIV = $("<a>")
      .attr("id", "saveArticleBTN")
      .addClass("tiny button")
      .attr("data-id", data[i]._id);

    if (data[i].saved) {
      savedDIV.addClass("warning").text("Article Saved");
      calloutDIV.addClass("success");
    } else {
      savedDIV.addClass("success").text("Save Article");
    }

    calloutDIV
      .append(headlineH)
      .append(summaryP)
      .append(linkP)
      .append(savedDIV);

    $("#articles").append(calloutDIV);
  }
});

function loadPage() {}

// * get Just the Saved Articles
$(document).on("click", "#savedBTN", function() {
  $.getJSON("/articles/saved", function(data) {
    // For each one
    $("#articles").empty();
    for (var i = 0; i < data.length; i++) {
      // create Callouts for the articles
      var calloutDIV = $("<div>")
        .addClass("callout")
        .attr("data-id", data[i]._id)
        .attr("id", data[i]._id);

      var headlineH = $("<h4>")
        .attr("data-id", data[i]._id)
        .text(data[i].headline);

      var summaryP = $("<p>")
        .addClass("summary")
        .attr("data-id", data[i]._id)
        .text(data[i].summary);

      var linkP = $("<p>").addClass("artlink");

      var linkA = $("<a>")
        .attr("href", "http://www.globalissues.org" + data[i].link)
        .text("See More");
      linkP.append(linkA);

      var savedDIV = $("<a>")
        .attr("id", "saveArticleBTN")
        .addClass("tiny button")
        .attr("data-id", data[i]._id);

      if (data[i].saved) {
        savedDIV.addClass("warning").text("Article Saved");
        calloutDIV.addClass("success");
      } else {
        savedDIV.addClass("success").text("Save Article");
      }

      calloutDIV
        .append(headlineH)
        .append(summaryP)
        .append(linkP)
        .append(savedDIV);

      $("#articles").append(calloutDIV);
    }
  });
});

// * Whenever someone clicks a p tag and Wants to add a note
$(document).on("click", "p.summary", function() {
  // Empty the notes from the note section
  $(".noteBox").remove();

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      var noteBox = $("<div>").addClass("callout success noteBox");
      // var noteH6 = $("<h6>").text(data.headline);
      var noteTitleDiv = $("<input>")
        .attr("type", "text")
        .attr("id", "titleinput")
        .attr("name", "title");
      var noteTextDiv = $("<textarea>")
        .attr("row", "4")
        .attr("id", "bodyinput")
        .attr("name", "body");
      var svbtnDiv = $("<button>")
        .addClass("tiny secondary button")
        .attr("data-id", data._id)
        .attr("id", "savenote")
        .text("Save Note");
      noteBox
        // .append(noteH6)
        .append(noteTitleDiv)
        .append(noteTextDiv)
        .append(svbtnDiv);

      // $("#notes").append(noteBox);
      var theDiv = "#" + data._id;
      var targetDiv = $(theDiv);

      targetDiv.append(noteBox);

      // If there's a note in the article
      if (data.note) {
        // Place the headline of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// *  When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $(".noteBox").remove();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// * When user clicks save article button
$(document).on("click", "#saveArticleBTN", function() {
  // grab the ID associated with the article from the save button
  var thisId = $(this).attr("data-id");
  // run a post reguest to update to toggle the saved of the article
  $.ajax({ method: "POST", url: "/articleSave/" + thisId });
  $(this).text("saved");

});

// * Refresh Articles when Refresh button
$(document).on("click", "#refreshBTN", function() {
  $.getJSON("/refresh", function(data) {
    // For each one
    $("#articles").empty();
    for (var i = 0; i < data.length; i++) {
      // create Callouts for the articles
      var calloutDIV = $("<div>")
        .addClass("callout")
        .attr("data-id", data[i]._id)
        .attr("id", data[i]._id);

      var headlineH = $("<h4>")
        .attr("data-id", data[i]._id)
        .text(data[i].headline);

      var summaryP = $("<p>")
        .addClass("summary")
        .attr("data-id", data[i]._id)
        .text(data[i].summary);

      var linkP = $("<p>").addClass("artlink");

      var linkA = $("<a>")
        .attr("href", "http://www.globalissues.org" + data[i].link)
        .text("See More");
      linkP.append(linkA);

      var savedDIV = $("<a>")
        .attr("id", "saveArticleBTN")
        .addClass("tiny button")
        .attr("data-id", data[i]._id);

      if (data[i].saved) {
        savedDIV.addClass("warning").text("Article Saved");
        calloutDIV.addClass("success");
      } else {
        savedDIV.addClass("success").text("Save Article");
      }

      calloutDIV
        .append(headlineH)
        .append(summaryP)
        .append(linkP)
        .append(savedDIV);

      $("#articles").append(calloutDIV);
    }
    // loadPage();
  }).then(location.reload());
});

// $(document).ready(loadPage());
