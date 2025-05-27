const mongoose = require('mongoose');
const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String
  }]
});

module.exports = mongoose.model('Test', testSchema);