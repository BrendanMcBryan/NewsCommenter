var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB Locally
// mongoose.connect("mongodb://localhost/newsScraperGlobalIssues", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// ! Below is the code for connecting to Heroku DB ¡
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/newsScraperGlobalIssues";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes

// ? This no longer working, Seems like I hit the AP site a bit too much and the decided they are not THAT much of a news service.
// A GET route for scraping the AP Top News Wire website
// app.get("/scrape", function(req, res) {
//   // First, we grab the body of the html with axios
//   axios.get("https://apnews.com/apf-topnews").then(function(response) {
//     // Then, we load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(response.data);
//     // console.log($);
//     // ! we need all the stuff from a .FeedCard class
//     // ! headline is <h1>
//     // ! summary is <p>
//     // ! link is the <a class = "headline"

//     $(".FeedCard").each(function(i, element) {
//       // Save an empty result object
//       var result = {};

//       // Add the text and href of every link, and save them as properties of the result object
//       result.headline = $("h1", this).text();
//       console.log(result.headline + "HI 👨‍👩‍👦‍👦");
//       result.summary = $("p", this).text();
//       // result.summary = $(this).children(".content > p").text();

//       result.link = $("a.headline", this).attr("href");

// * Trying a differnt, hopefully less snooty site.
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.globalissues.org/news").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    $("li.headline").each(function(i, element) {
      // Save an empty result object
      var result = {};
      var headlineDiv = $(this).children("h2");

      result.headline = $(headlineDiv)
        .children("a")
        .text();
      result.link = $(headlineDiv)
        .children("a")
        .attr("href");
      var summaryP = $("p", this);
      result.summary = $(summaryP)
        .not(".page-intro-summary-info")
        .text();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          // console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all Saved Articles from the db
app.get("/articles/saved", function(req, res) {
  // Grab every saved article in the Articles collection
  db.Article.find({ saved: true })
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// route for updating a saved Article
app.post("/articleSave/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: req.params.id },
    { saved: true },
    { new: true }
  ).then(function(dbArticle) {
    // If we were able to successfully update an Article, send it back to the client
    res.json(dbArticle);
  });
});

// Start the server
// app.listen(PORT, function() {
//   console.log("App running on port " + PORT + "!");
// });

app.listen(process.env.PORT || 3000, function() {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
