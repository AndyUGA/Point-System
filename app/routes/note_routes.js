var ObjectID = require("mongodb").ObjectID;
const http = require("http");

module.exports = function(app, db) {
  //Displays home page
  app.get("/", (req, res) => {
    let collection = db.collection("Members");

    collection.find({}).toArray(function(err, result) {
      if (err) {
        res.send({ error: " An error has occurred" });
      } else {
        res.render("index", { result: result });
      }
    });
  });

  //Displays page based on parameter
  app.get("/Element/:nameOfFile", (req, res) => {
    let nameOfFile = req.params.nameOfFile;
    console.log("Name of file is : " + nameOfFile);
    const memberCollection = db.collection("Members");
    const historyCollection = db.collection("History");
    const houseCollection = db.collection("Houses");

    if (nameOfFile == "attendeePoints" || nameOfFile == "stylesheet.css") {
      let houseResults;
      memberCollection
        .find({})
        .sort({ Name: 1 })
        .toArray(function(err, memberResults) {
          if (err) {
            res.send({ error: " An error has occurred" });
          } else {
            res.render("attendeePoints", {
              memberResults: memberResults
            });
          }
        });
    } else if (nameOfFile == "attendeeInfo") {
      let hrResults;
      houseCollection.find({}).toArray(function(err, houseResults) {
        memberCollection
          .find({})
          .sort({ Name: 1 })
          .toArray(function(err, memberResults) {
            if (err) {
              res.send({ error: " An error has occurred" });
            } else {
              res.render("attendeeInfo", {
                houseResults: houseResults,
                memberResults: memberResults
              });
            }
          });
      });
    } else if (nameOfFile == "history") {
      historyCollection.find({}).toArray(function(err, historyResults) {
        if (err) {
          res.send({ error: " An error has occurred" });
        } else {
          res.render("history", {
            historyResults: historyResults
          });
        }
      });
    } else if (nameOfFile == "housePoints") {
      memberCollection.find({}).toArray(function(err, memberResults) {
        houseCollection.find({}).toArray(function(err, houseResults) {
          if (err) {
            res.send({ error: " An error has occurred: " + err });
          } else {
            res.render("housePoints", {
              memberResults: memberResults,
              houseResults: houseResults
            });
          }
        });
      });
    } else {
      res.send("An error occurred");
    }
  });

  //Search for attendee based on input from search bar
  app.post("/searchAttendeePoints", (req, res) => {
    let attendeeName = req.body.attendeeName;

    collection = db.collection("Members");
    let query = { Name: { $regex: attendeeName, $options: "$i" } };
    collection
      .find(query)
      .sort({ Name: 1 })
      .toArray(function(err, memberResults) {
        if (err) {
          console.log("Error is " + err);
          res.send({ error: " An error has occurred" });
        } else {
          res.render("attendeePoints", {
            memberResults: memberResults
          });
        }
      });
  });

  //Search for attendee based on input from search bar
  app.post("/searchAttendeeInfo", (req, res) => {
    let attendeeName = req.body.attendeeName;

    var collection = db.collection("Houses");
    var hrResults;
    collection.find({}).toArray(function(err, houseResults) {
      hrResults = houseResults;
      collection = db.collection("Members");
      let query = { Name: { $regex: attendeeName, $options: "$i" } };
      collection.find(query).toArray(function(err, memberResults) {
        if (err) {
          console.log("Error is " + err);
          res.send({ error: " An error has occurred" });
        } else {
          console.log(memberResults);
          res.render("attendeeInfo", {
            houseResults: hrResults,
            memberResults: memberResults
          });
        }
      });
    });
  });

  //Search for attendee based on input from search bar
  app.post("/Element/:nameOfContents", (req, res) => {
    let nameOfContents = req.params.nameOfContents;
    let attendeeName = req.body.attendeeName;
    const memberCollection = db.collection("Members");

    if (nameOfContents == "attendeePoints") {
      let query = { Name: { $regex: attendeeName, $options: "$i" } };
      memberCollection
        .find(query)
        .sort({ Name: 1 })
        .toArray(function(err, memberResults) {
          if (err) {
            console.log("Error is " + err);
            res.send({ error: " An error has occurred" });
          } else {
            res.render("attendeePoints", {
              memberResults: memberResults
            });
          }
        });
    } else if (nameOfContents == "attendeeInfo") {
      const housecollection = db.collection("Houses");
      const memberCollection = db.collection("Members");

      housecollection.find({}).toArray(function(err, houseResults) {
        let query = { Name: { $regex: attendeeName, $options: "$i" } };
        memberCollection
          .find(query)
          .sort({ Name: 1 })
          .toArray(function(err, memberResults) {
            if (err) {
              console.log("Error is " + err);
              res.send({ error: " An error has occurred" });
            } else {
              console.log(memberResults);
              res.render("attendeeInfo", {
                houseResults: houseResults,
                memberResults: memberResults
              });
            }
          });
      });
    }
  });

  //Get form to modify points
  app.post("/modifyPointsForm", (req, res) => {
    const name = req.body.tempName;
    const points = req.body.points;
    const house = req.body.house;
    console.log("name is " + name);
    console.log("points is " + points);
    console.log("house is " + house);

    res.render("forms/modifyValuesForm", { name: name, points: points, house: house });
  });

  //Update score for attendee
  app.post("/increasePoints/:name/:points/:house/:redirect", (req, res) => {
    const memberCollection = db.collection("Members");
    let pointsToAdd = 0;

    if (req.body.points == undefined) {
      pointsToAdd = parseInt(req.params.points);
    } else {
      pointsToAdd = parseInt(req.body.points);
    }

    const redirect = req.params.redirect;
    const attendeeName = req.params.name;
    const attendeeHouse = req.params.house;
    let operation = req.body.operation;

    memberCollection.find({}).toArray(function(err, result) {
      for (var i = 0; i < result.length; i++) {
        if (attendeeName == result[i].Name) {
          const attendee = result[i];
          const currentPoints = parseInt(attendee.Points);
          const attendeeID = { _id: new ObjectID(attendee._id) };

          let calculatedPoints = 0;
          if (operation == "subtract") {
            calculatedPoints = currentPoints - pointsToAdd;
          } else {
            operation = "add";
            calculatedPoints = currentPoints + pointsToAdd;
          }
          const attendeeContent = {
            $set: {
              Name: attendeeName,
              House: attendeeHouse,
              Points: calculatedPoints
            }
          };

          memberCollection.updateOne(attendeeID, attendeeContent, (err, item) => {
            if (err) {
              console.log("Error is " + err);
              res.send({ "Error is ": +err });
            } else {
              res.redirect("/increaseHousePoints/" + attendeeName + "/" + attendeeHouse + "/" + pointsToAdd + "/" + redirect + "/" + operation);
            }
          });
          break;
        }
      }
    });
  });

  //Update score for attendee house
  app.get("/increaseHousePoints/:name/:house/:pointsToAdd/:redirect/:operation", (req, res) => {
    const houseName = req.params.house;
    const name = req.params.name;
    const pointsToAdd = req.params.pointsToAdd;
    const redirect = req.params.redirect;
    let operation = req.params.operation;
    const houseCollection = db.collection("Houses");

    houseCollection.find({}).toArray(function(err, result) {
      for (var i = 0; i < result.length; i++) {
        const houseInfo = result[i];
        if (houseName == houseInfo.Name) {
          const houseID = { _id: new ObjectID(houseInfo._id) };

          const currentHousePoints = houseInfo.Points;

          let totalHousePoints = 0;

          if (operation == "subtract") {
            totalHousePoints = parseInt(currentHousePoints) - parseInt(pointsToAdd);
          } else {
            operation = "add";
            totalHousePoints = parseInt(currentHousePoints) + parseInt(pointsToAdd);
          }

          const houseContent = {
            $set: {
              Name: houseInfo.Name,
              Points: totalHousePoints
            }
          };

          houseCollection.updateOne(houseID, houseContent, (err, item) => {
            if (err) {
              console.log("Error is " + err);
              res.send({ "Error is ": +err });
            } else {
              res.redirect("/record/" + name + "/" + pointsToAdd + "/" + houseName + "/" + redirect + "/" + operation);
            }
          });

          //Break out of loop if a match is found
          break;
        }
      }
    });
  });

  //Record point increases on history page
  app.get("/record/:name/:points/:house/:redirect/:operation", (req, res) => {
    console.log("Entering record method");

    const operation = req.params.operation;
    const redirect = req.params.redirect;
    const historyCollection = db.collection("History");
    let pointsToAdd = req.params.points;
    const attendeeName = req.params.name;
    const attendeeHouse = req.params.house;

    if (operation == "subtract") {
      pointsToAdd = "-" + pointsToAdd;
    } else {
      pointsToAdd = "+" + pointsToAdd;
    }

    const attendeeContent = {
      Name: attendeeName,
      House: attendeeHouse,
      Points: pointsToAdd
    };

    historyCollection.insertOne(attendeeContent, (err, item) => {
      if (err) {
        console.log("Error is " + err);
        res.send({ "Error is ": +err });
      } else {
        if (redirect == "yesRedirect") {
          res.redirect("/Element/attendeeInfo");
        } else {
          console.log("Action has been recorded to history page");
        }
      }
    });
  });
};
