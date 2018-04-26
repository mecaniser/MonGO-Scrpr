//Require models
var Articles = require('../models/articles.js');
var notes = require('../models/notes.js');
//require request and cheerio to scrape
var request = require('request');
var cheerio = require('cheerio');
//dependencies
var express = require('express');
var router = express.Router();
var path = require('path');
//index
router.get('/', function(req, res) {
    res.redirect('/articles');
});

// A GET request to scrape the Aljazeera website
router.get('/scrape', function(req, res) {
    // First, we grab the body of the html with request
    request('https://www.aljazeera.com/investigations/', function(error, response, html) {
        var $ = cheerio.load(html);
        var titlesArray = [];
        // Now, we grab every article
        $('article.blurb').each(function(i, element) {
            // Save an empty result object
            var result = [];

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).text();
            result.link = $(this).children('a').attr('href');

            //Exclude any empty title or links 
            if(result.title !== "" && result.link !== ""){
              //Exclude duplicates
              if(titlesArray.indexOf(result.title) == -1){

                //Populate saved title to the array 
                titlesArray.push(result.title);

                // Unique Article
                Articles.count({ title: result.title}, function (err, test){
                    //if the test is 0, the entry is unique and good to save
                  if(test == 0){

                    //using Article model, create new object
                    var entry = new Articles (result);

                    //save entry to mongodb
                    entry.save(function(err, doc) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log(doc);
                      }
                    });

                  }
            });
        }
        // Log that scrape is working, just the content was missing parts
        else{
          console.log('Article already exists.')
        }

          }
          // Log that scrape is working, just the content was missing parts
          else{
            console.log('Not saved to DB, missing data')
          }
        });
        // after scrape, redirects to index
        res.redirect('/articles');
    });
});

//this will grab every article an populate the DOM
router.get('/articles', function(req, res) {
    //allows newer articles to be on top
    Articles.find().sort({_id: -1})
        //send to handlebars
        .exec(function(err, doc) {
            if(err){
                console.log(err);
            } else{
                var articles = {article: doc};
                res.render('index', articles);
            }
    });
});

// This will get the articles we scraped from the mongoDB in JSON
router.get('/jason-data', function(req, res) {
    Articles.find({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});

//clear all articles for testing purposes
router.get('/clearAll', function(req, res) {
    Articles.remove({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log('All Articles Cleared, Scrap it again');
        }

    });
    res.redirect('/');
});

router.get('/readArticle/:id', function(req, res){
  var articleId = req.params.id;
  var hbsObj = {
    article: [],
    body: []
  };

    // //find the article at the id
    Articles.findOne({ _id: articleId })
      .populate('notes')
      .exec(function(err, doc){
      if(err){
        console.log('Error: ' + err);
      } else {
        hbsObj.article = doc;
        var link = doc.link;
        //grab article from link
        request(link, function(error, response, html) {
          var $ = cheerio.load(html);

          $('.item').each(function(i, element){
            hbsObj.body = $(this).children('a').children('href').text();
            //send article body and notes to article.handlbars through hbObj
            res.render('article', hbsObj);
            //prevents loop through so it doesn't return an empty hbsObj.body
            return false;
          });
        });
      }
    });
});

// Create a new note
router.post('/notes/:id', function(req, res) {
  var user = req.body.name;
  var content = req.body.note;
  var articleId = req.params.id;

  //submitted form
  var noteObj = {
    name: user,
    body: content
  };
 
  //using the notes model, create a new note
  var Notes = new Notes(noteObj);

  newNotes.save(function(err, doc) {
      if (err) {
          console.log(err);
      } else {
          console.log(doc._id)
          console.log(articleId)
          Articless.findOneAndUpdate({ "_id": req.params.id }, {$push: {'notes':doc._id}}, {new: true})
            //execute everything
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/readArticle/' + articleId);
                }
            });
        }
  });
});

module.exports = router;