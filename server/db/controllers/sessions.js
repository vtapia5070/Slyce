var Sessions = require('../config.js').Sessions;
var promises = require('bluebird');


module.exports = {
  // method to create session id, and respond with qa_ID to client
  saveSession: function (data, cb) {
    console.log("data in controller is", data);
    Sessions.create(data)
      .then(function (result){
        /* sends back: 
          {
            "id": 2,
            "host_name": "victoria",
            "start_time": "Wednesday 12pm",
            "end_time": "Wednesday 1pm"
          }
        */
        cb(result.dataValues);
      }).catch();
  },
  // retrieve a session by qa_id
  retrieveSession: function (num, cb) {
    // may have to update to retrieve questions and answers
    Sessions.find({where: {id: num}})
      .then(function (info) {
        console.log("info in retrieve session promise", info.dataValues);
        cb(info.dataValues);
      }).catch();
  }
};

