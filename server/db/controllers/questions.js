// This file queries the database to save and retrieve questions

var Questions = require('../config.js').Questions;
var Sessions = require('./sessions.js');
var Answers = require('./answers.js');
var answers = require('../config.js').Answers;
var promises = require('bluebird');

module.exports = {

  // method to save questions
  saveQuestion: function (num, data, cb) {
    Sessions.retrieveSession(num, function (sessionData) {
      data.sessionId = sessionData.id;
      data.answered = "false";
      Questions.create(data)
        .then(function (result) {
          cb(result.dataValues);
        }).catch();
    });
  },
  retrieveQuestions: function (num, cb) {
    Questions.findAll({where: {sessionId: num} })
      .then(function (list){
        var results = [];
        list.forEach(function (i) {
          results.push(i.dataValues);
        });
        cb(results, results.length);
      }).catch();
  },
  getUnansweredQuestions: function (num, cb) {
    // console.log("getting all questions-num", num);
    module.exports.retrieveQuestions(num, function (data, length) {
      var filteredList = [];
      for (var i = 0; i <= data.length; i++) {
        (function (i) {
          if (data[i] && data[i].answered === "true") {
            // console.log("testttt", data[i]);
            Answers.getAnswers(data[i].id, function (answer) {
              console.log("data", data[i]);
              data[i].answer = answer;
              filteredList.push(data[i]);
              console.log("length:", length, "i:", i);
              if (i === length) {
                console.log("FILTEREDLIST", filteredList);
                cb(filteredList, length);
              } else {
                return filteredList;
              }
            });
          }
        })(i);
      }
    });
  },
  getAllQuestions: function (num, cb) {
    console.log("getting all questions-num", num);
    this.getUnansweredQuestions(num, function (list) {
      console.log("answered questions", list);
      Questions.findAll({where: {answered: "false"}})
      .then(function (questions) {
        console.log("un-answered questions", list);
        var newList = questions.concat(list);
        console.log("this is the new list", newList);
        cb(newList);
      }).catch();
    });
  }
    // this.getAllQuestions(num, function (list, length) {
    //   for (var i = 0; i <= list.length; i++) {
    //   var filteredList = [];
    //     (function (i, filteredList) {
    //       if (list[i] && list[i].answered === "true") {
    //         filteredList.push(list[i]);
    //       }
    //       if ((i+1) === length) {
    //   console.log("len:", length, "filteredList", filteredList);
    //         console.log("LIST", filteredList);
    //         cb(filteredList);
    //       }
    //     })(i, filteredList);
    //     cb(filteredList);
    //   }
    // });
    // this.retrievedQuestions(num, function (list) {
    //   for (var i = 0; i < list.length; i++) {
    //     if (list[i].answered === "false") {
    //       filteredList.push(list[i]);
    //     }
    //   }
    // });
    // console.log("filteredList", filteredList);
  // }
};

// module.exports.getQuestionInfo(1, function (data) {
//   console.log("THIS IS THE RESULT", data);
// });
