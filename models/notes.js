var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NotesSchema = new Schema({
  name: {
    type: String
  },
  body: {
    type: String,
    required: true
  }
});

var Notes = mongoose.model("Notes", NotesSchema);

module.exports = Notes;

