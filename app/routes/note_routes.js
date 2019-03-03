var ObjectID = require("mongodb").ObjectID;
const http = require("http");

module.exports = function(app, db) {
  var testFunction = function(req, res) {
    console.log("req is ");
    console.log(req);
    console.log("res is ");
    console.log(res);
  };

  //Displays home page
  app.get("/", (req, res) => {
    var collection = db.collection("Members");
    var currentNotes = [];

    collection.find({}).toArray(function(err, result) {
      if (err) {
        res.send({ error: " An error has occurred" });
      } else {
        res.render("index", { result: result });
      }
    });
  });

  //Get page to display hwo many points each attendee has
  app.get("/attendeePoints", (req, res) => {
    var collection = db.collection("Members");
    var houseResults;

    collection.find({}).toArray(function(err, memberResults) {
      if (err) {
        res.send({ error: " An error has occurred" });
      } else {
        res.render("attendeePoints", {
          memberResults: memberResults
        });
      }
    });
  });

  //Get page to display how many points each house has
  app.get("/housePoints", (req, res) => {
    var collection = db.collection("Members");
    var houseResults;

    collection.find({}).toArray(function(err, memberResults) {
      collection = db.collection("Houses");
      collection.find({}).toArray(function(err, result) {
        houseResults = result;

        if (err) {
          res.send({ error: " An error has occurred" });
        } else {
          res.render("housePoints", {
            memberResults: memberResults,
            houseResults: houseResults
          });
        }
      });
    });
  });

  //Get page to display how many points each house has
  app.get("/history", (req, res) => {
    var collection = db.collection("History");

    collection.find({}).toArray(function(err, historyResults) {
      if (err) {
        res.send({ error: " An error has occurred" });
      } else {
        res.render("history", {
          historyResults: historyResults
        });
      }
    });
  });
  //Get form to modify points
  app.get("/modifyPoints", (req, res) => {
    var collection = db.collection("Houses");
    var hrResults;
    collection.find({}).toArray(function(err, houseResults) {
      hrResults = houseResults;
      collection = db.collection("Members");
      collection.find({}).toArray(function(err, memberResults) {
        if (err) {
          res.send({ error: " An error has occurred" });
        } else {
          res.render("modifyPointValues", {
            houseResults: hrResults,
            memberResults: memberResults
          });
        }
      });
    });
  });

  app.get("/modifyPointsForm/:name/:points", (req, res) => {
    const name = req.params.name;
    const points = req.params.points;
    res.render("forms/modifyValuesForm");
  });

  //Update score for attendee
  app.post("/increasePoints/:name/:points/:house", (req, res) => {
    const collection = db.collection("Members");
    const pointsToAdd = parseInt(req.params.points);
    const attendeeName = req.params.name;
    const attendeeHouse = req.params.house;

    collection.find({}).toArray(function(err, result) {
      for (var i = 0; i < result.length; i++) {
        if (attendeeName == result[i].Name) {
          const attendee = result[i];
          const currentPoints = parseInt(attendee.Points);
          const attendeeID = { _id: new ObjectID(attendee._id) };
          const attendeeContent = {
            $set: {
              Name: attendeeName,
              House: attendeeHouse,
              Points: currentPoints + pointsToAdd
            }
          };

          db.collection("Members").updateOne(attendeeID, attendeeContent, (err, item) => {
            if (err) {
              console.log("Error is " + err);
              res.send({ "Error is ": +err });
            } else {
              res.redirect("/increaseHousePoints/" + attendeeHouse + "/" + pointsToAdd);
            }
          });
          break;
        }
      }
    });
  });

  //Update score for attendee house
  app.get("/increaseHousePoints/:house/:pointsToAdd", (req, res) => {
    const houseName = req.params.house;
    const pointsToAdd = req.params.pointsToAdd;
    const collection = db.collection("Houses");

    collection.find({}).toArray(function(err, result) {
      for (var i = 0; i < result.length; i++) {
        const houseInfo = result[i];
        if (houseName == houseInfo.Name) {
          const houseID = { _id: new ObjectID(houseInfo._id) };

          const currentHousePoints = houseInfo.Points;

          const totalHousePoints = parseInt(currentHousePoints) + parseInt(pointsToAdd);
          const houseContent = {
            $set: {
              Name: houseInfo.Name,
              Points: totalHousePoints
            }
          };

          db.collection("Houses").updateOne(houseID, houseContent, (err, item) => {
            if (err) {
              console.log("Error is " + err);
              res.send({ "Error is ": +err });
            } else {
              res.redirect("/attendeePoints");
            }
          });

          //Break out of loop if a match is found
          break;
        }
      }
    });
  });

  //Record point increases on history page
  app.post("/record/:name/:points/:house", (req, res) => {
    const collection = db.collection("History");
    const pointsToAdd = parseInt(req.params.points);
    const attendeeName = req.params.name;
    const attendeeHouse = req.params.house;

    const attendeeContent = {
      Name: attendeeName,
      House: attendeeHouse,
      Points: pointsToAdd
    };

    collection.insertOne(attendeeContent, (err, item) => {
      if (err) {
        console.log("Error is " + err);
        res.send({ "Error is ": +err });
      } else {
        console.log("Action has been recorded to history page");
      }
    });
  });

  //Added points to Houses based on form
  app.post("/modifyPoints", (req, res) => {
    const collection = db.collection("Houses");
    const points = parseInt(req.body.points);
    const attendeeHouse = req.body.selectedHouse;
    const operation = req.body.operation;

    let houseID;
    let currentHousePoints;

    collection.find({}).toArray(function(err, houseResults) {
      console.log(houseResults);
      for (var i = 0; i < houseResults.length; i++) {
        if (houseResults[i].Name == attendeeHouse) {
          houseID = { _id: new ObjectID(houseResults[i]._id) };
          currentHousePoints = houseResults[i].Points;
        }
      }
      let modifiedPoints = 0;
      if (operation == "add") {
        modifiedPoints = points + parseInt(currentHousePoints);
      } else if (operation == "subtract") {
        modifiedPoints = parseInt(currentHousePoints) - points;
      }
      const modifyPointsContent = {
        $set: {
          Points: modifiedPoints
        }
      };

      collection.updateOne(houseID, modifyPointsContent, (err, item) => {
        if (err) {
          res.send({ error: err });
          console.log("Error is " + err);
        } else {
          res.redirect("/housePoints");
        }
      });
    });
  });
};
