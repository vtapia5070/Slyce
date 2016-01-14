//This module queries questions and answers for the answer model

var Answers = require('../config.js').Answers;
var Questions = require('../config.js').Questions;

module.exports = {
  // method to retrieve question by id and add answer ID
  saveAnswer: function (questionId, data, cb) {
    // update answered to true
    Questions.update({ answered: "true"}, {where: {id: questionId}})
    .then(function (question) {
    }).catch();
    // find questionID
    Questions.findById(questionId)
    .then(function (question) {
      data.questionId = question.dataValues.id;
      // save answer
      Answers.create(data)
      .then(function (answer) {
        cb(answer.dataValues);
      });
    });
  },
  getAnswers: function (id, cb) {
    Answers.findOne({where: {questionId: id}})
    .then(function (answer) {
      cb(answer.dataValues);
    }).catch();
  }
};

// module.exports.getAnswers(1, function (data) {
//   console.log("THIS IS THE RESULT", data);
// });

