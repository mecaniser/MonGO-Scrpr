


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphndlbrs = require("express-handlebars");
var notes = require("./models/notes.js");
var articles = require("./models/articles.js")


console.log("***Start Sraping***");

// Require all models
var db = require("./models");
var PORT = 3000;
// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/week18Populater");


rqst("http://www.aljazeera.com/", function (err, res, body) {
    if (err) {
        console.log('Check this error: ' + err)
    } else {
        var $ = cheerio.load(body);
        // console.log($);
        //Create an empty array for the Scraper result
        var scrprRslts = [];
        var artclNum = 0;

        $("article.latestNews").each(function (i, element) {
            var title = $(this).find("header").find('a').attr("title");
            var url = 'aljazeera.com ' + $(this).find('a').attr('href');
            console.log(url + '|' + title);
            var artclInfo = {
                'index': i,
                'title': title,
                'description': description,
                'url': url
                // 'date': date,
                // 'img': img
            };
            scrprRslts.push(artclInfo);

        });
        console.log('Info: ' + scrprRslts);
    }
})
