


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
// var axios = require("axios");
var cheerio = require("cheerio");
// var bodyParser = require("body-parser");
// var logger = require("morgan");
// var mongoose = require("mongoose");
// var exphndlbrs = require("express-handlebars");
// var notes = require("./models/notes.js");
// var articles = require("./models/articles.js")
var request = require("request");


console.log("***Start Scrapping***");

// Require all models
// var db = require("./models");
// var PORT = 3000;
// Initialize Express
// var app = express();

// Configure middleware

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Use body-parser for handling form submissions
// app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
// app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/week18Populater");


// Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
request("https://www.aljazeera.com/investigations/", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("article.blurb").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var title = $(element).text();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).children().attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      artcleTitle: title,
      artcleLink: link
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
