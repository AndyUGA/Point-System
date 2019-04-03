var ObjectID = require("mongodb").ObjectID;
const http = require("http");

module.exports = function(app, db) {
  const memberCollection = db.collection("Members");
  const historyCollection = db.collection("History");
  const houseCollection = db.collection("Houses");
  const workshopCollection = db.collection("Workshops");

  //Displays home page
  app.get("/", (req, res) => {
    memberCollection.find({}).toArray(function(err, result) {
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
    //console.log("Name of file is : " + nameOfFile);

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
      historyCollection
        .find({})
        .sort({ _id: -1 })
        .toArray(function(err, historyResults) {
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
    } else if (nameOfFile == "workshop") {
      workshopCollection.find({}).toArray(function(err, workshopResults) {
        if (err) {
          res.send({ error: " An error has occurred" });
        } else {
          res.render("workshop", {
            workshopResults: workshopResults
          });
        }
      });
    } else {
      res.send("An error occurred");
    }
  });

  //Returns search results based on input from search bar
  app.post("/Element/:searchContents", (req, res) => {
    let searchContents = req.params.searchContents;
    let attendeeName = req.body.attendeeName;
    let query = { Name: { $regex: attendeeName, $options: "$i" } };
    //Display search results for attendee points page
    if (searchContents == "attendeePoints") {
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
      //Display search results for attendee info page
    } else if (searchContents == "attendeeInfo") {
      housecollection.find({}).toArray(function(err, houseResults) {
        memberCollection
          .find(query)
          .sort({ Name: 1 })
          .toArray(function(err, memberResults) {
            if (err) {
              console.log("Error is " + err);
              res.send({ error: " An error has occurred" });
            } else {
              res.render("attendeeInfo", {
                houseResults: houseResults,
                memberResults: memberResults
              });
            }
          });
      });
      //Redirects to modify points form
    } else if (searchContents == "modifyPointsForm") {
      const name = req.body.tempName;
      const points = req.body.points;
      const house = req.body.house;
      console.log("name is " + name);
      console.log("points is " + points);
      console.log("house is " + house);

      res.render("forms/modifyValuesForm", {
        name: name,
        points: points,
        house: house
      });
    }
  });

  //Update workshop status
  app.post("/Workshop/:name/:workshopName", (req, res) => {
    const workshopName = req.params.workshopName;
    const attendeeName = req.params.name;
    let attendeeContent;

    memberCollection.find({}).toArray(function(err, result) {
      const PhotographyPoints = 50;
      const LearnignPoints = 50;
      const LeadershipPoints = 50;

      for (var i = 0; i < result.length; i++) {
        if (attendeeName == result[i].Name) {
          const attendee = result[i];
          const attendeeID = { _id: new ObjectID(attendee._id) };

          if (workshopName == "Photography") {
            attendeeContent = {
              $set: {
                Workshop1IsActive: true,
                Points: attendee.Points + PhotographyPoints
              }
            };
          } else if (workshopName == "Learning") {
            attendeeContent = {
              $set: {
                Workshop2IsActive: true,
                Points: attendee.Points + LearnignPoints
              }
            };
          } else if (workshopName == "Leadership") {
            attendeeContent = {
              $set: { Workshop3IsActive: true, Points: attendee.Points + LeadershipPoints }
            };
          }

          memberCollection.updateOne(attendeeID, attendeeContent, (err, item) => {
            if (err) {
              console.log("Error is " + err);
              res.send({ "Error is ": +err });
            } else {
              //console.log("Workshop status updated!");
            }
          });
        }
      }
    });
  });

  //Update score for attendee
  app.post("/increasePoints/:name/:points/:house/:redirect", (req, res) => {
    let pointsToAdd = 0;

    if (req.body.points == undefined) {
      pointsToAdd = parseInt(req.params.points);
    } else {
      pointsToAdd = parseInt(req.body.points);
    }
    console.log("Points to add is " + pointsToAdd);
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
          console.log("Updated points are: " + calculatedPoints);
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

  //Record point modifications on history page
  app.get("/record/:name/:points/:house/:redirect/:operation", (req, res) => {
    const operation = req.params.operation;
    const redirect = req.params.redirect;
    const attendeeName = req.params.name;
    const attendeeHouse = req.params.house;

    let pointsToAdd = req.params.points;

    if (operation == "subtract") {
      pointsToAdd = "-" + pointsToAdd;
    } else {
      pointsToAdd = "+" + pointsToAdd;
    }

    const attendeeContent = {
      Name: attendeeName,
      House: attendeeHouse,
      Points: pointsToAdd,
      timeRecorded: new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
    };

    historyCollection.insertOne(attendeeContent, (err, item) => {
      if (err) {
        console.log("Error is " + err);
        res.send({ "Error is ": +err });
      } else {
        if (redirect == "yesRedirect") {
          res.redirect("/Element/attendeeInfo");
        } else {
          //console.log("Action has been recorded to history page");
        }
      }
    });
  });
};
