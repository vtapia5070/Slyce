var mysql = require('mysql');
var Sequelize = require("sequelize");
var sequelize = new Sequelize("qa", "root", '', {
  define: {
    timestamps: false
  }
});

// describe tables
exports.Sessions = sequelize.define('sessions', {
  start_time: Sequelize.STRING,
  end_time: Sequelize.STRING,
  host_name: Sequelize.STRING
});

exports.Questions = sequelize.define('questions', {
  asked_by_name: Sequelize.STRING,
  text: Sequelize.STRING,
  answered: Sequelize.STRING,
  sessionId: Sequelize.INTEGER
});

exports.Answers = sequelize.define('answers', {
  answered_by_name: Sequelize.STRING,
  text: Sequelize.STRING,
  image_url: Sequelize.STRING
});

//describe table relationships
exports.Sessions.hasMany(exports.Questions, {as: 'sessionId'});

exports.Answers.belongsTo(exports.Questions); // questions will have answerID

// sync tables
exports.Sessions.sync().then(function(){
  console.log("sessions table has synced");
});

exports.Questions.sync().then(function(){
  console.log("questions table has synced");
});

exports.Answers.sync().then(function(){
  console.log("answers table has synced");
});

// module.exports = sessions;
// module.exports = questions;
// module.exports = answers;

