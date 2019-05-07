var ObjectID = require("mongodb").ObjectID;
const http = require("http");

module.exports = function(app, db) {
  const memberCollection = db.collection("Members");
  const historyCollection = db.collection("History");
  const houseCollection = db.collection("Houses");
  const workshopCollection = db.collection("Workshops");
  const eventCollection = db.collection("Events");

  //Displays home page
  app.get("/", (req, res) => {
    memberCollection.find({}).toArray(function(err, result) {
      if (err) {
        res.send({ error: " Error is " + err });
      } else {
        res.render("AdminPanel", { result: result });
      }
    });
  });

  function authentication(req, res, next) {
    let password = req.body.password;
    let pass = false;
    console.log("Password is " + password);
    if (password == "secret") {
      pass = true;
    }
    var isValid = pass; //your validation function
    if (isValid) {
      next(); // valid password username combination
    } else {
      res.render("error"); //Unauthorized
    }
  }

  app.post("/checkin", authentication, (req, res) => {
    memberCollection.find({}).toArray(function(err, result) {
      if (err) {
        res.send({ error: " Error is " + err });
      } else {
        res.render("admin/index", { result: result });
      }
    });
  });

  app.post("/attendeeInfo", authentication, (req, res) => {
    let searchContents = req.params.searchContents;

    houseCollection.find({}).toArray(function(err, houseResults) {
      memberCollection
        .find({})
        .sort({ Points: -1 })
        .toArray(function(err, memberResults) {
          if (err) {
            res.send({ error: " Error is " + err });
          } else {
            res.render("admin/attendeeInfo", {
              houseResults: houseResults,
              memberResults: memberResults
            });
          }
        });
    });
  });

  app.post("/history", authentication, (req, res) => {
    let searchContents = req.params.searchContents;
    historyCollection
      .find({})
      .sort({ _id: -1 })
      .toArray(function(err, historyResults) {
        if (err) {
          res.send({ error: " Error is " + err });
        } else {
          res.render("admin/history", {
            historyResults: historyResults
          });
        }
      });
  });

  //Displays page based on parameter
  app.get("/Element/:nameOfFile", (req, res) => {
    let nameOfFile = req.params.nameOfFile;

    //Will display attendee points page
    if (nameOfFile == "attendeePoints" || nameOfFile == "stylesheet.css") {
      let houseResults;
      memberCollection
        .find({})
        .sort({ Points: -1 })
        .toArray(function(err, memberResults) {
          if (err) {
            res.send({ error: " Error is " + err });
          } else {
            res.render("attendeePoints", {
              memberResults: memberResults,
              searchType: "attendeePoints",
              filterType: "All Houses"
            });
          }
        });
      //Will display attendee info page
    }
    //Will display all members by descending amount of points
    else if (nameOfFile == "housePoints") {
      memberCollection.find({}).toArray(function(err, memberResults) {
        houseCollection
          .find({})
          .sort({ Points: -1 })
          .toArray(function(err, houseResults) {
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
    } else if (nameOfFile == "attendeeInfo") {
      let searchContents = req.params.searchContents;

      houseCollection.find({}).toArray(function(err, houseResults) {
        memberCollection
          .find({})
          .sort({ Points: -1 })
          .toArray(function(err, memberResults) {
            if (err) {
              res.send({ error: " Error is " + err });
            } else {
              res.render("admin/attendeeInfo", {
                houseResults: houseResults,
                memberResults: memberResults
              });
            }
          });
      });
    }
    //Will display page filtered by Gryffindor house
    else if (nameOfFile == "attendeePointsGryffindor") {
      memberCollection
        .find({ House: "Gryffindor" })
        .sort({ Points: -1 })
        .toArray(function(err, memberResults) {
          houseCollection.find({}).toArray(function(err, houseResults) {
            if (err) {
              res.send({ error: " An error has occurred: " + err });
            } else {
              res.render("attendeePoints", {
                memberResults: memberResults,
                houseResults: houseResults,
                searchType: "attendeePointsG",
                filterType: "Gryffindor"
              });
            }
          });
        });
    }
    //Will display page filtered by Ravenclaw house
    else if (nameOfFile == "attendeePointsRavenclaw") {
      memberCollection
        .find({ House: "Ravenclaw" })
        .sort({ Points: -1 })
        .toArray(function(err, memberResults) {
          houseCollection.find({}).toArray(function(err, houseResults) {
            if (err) {
              res.send({ error: " An error has occurred: " + err });
            } else {
              res.render("attendeePoints", {
                memberResults: memberResults,
                houseResults: houseResults,
                searchType: "attendeePointsR",
                filterType: "Ravenclaw"
              });
            }
          });
        });
    }
    //Will display page filtered by Hufflepuff house
    else if (nameOfFile == "attendeePointsHufflepuff") {
      memberCollection
        .find({ House: "Hufflepuff" })
        .sort({ Points: -1 })
        .toArray(function(err, memberResults) {
          houseCollection.find({}).toArray(function(err, houseResults) {
            if (err) {
              res.send({ error: " An error has occurred: " + err });
            } else {
              res.render("attendeePoints", {
                memberResults: memberResults,
                houseResults: houseResults,
                searchType: "attendeePointsH",
                filterType: "Hufflepuff"
              });
            }
          });
        });
    }
    //Will display page filtered by Slytherin house
    else if (nameOfFile == "attendeePointsSlytherin") {
      memberCollection
        .find({ House: "Slytherin" })
        .sort({ Points: -1 })
        .toArray(function(err, memberResults) {
          houseCollection.find({}).toArray(function(err, houseResults) {
            if (err) {
              res.send({ error: " An error has occurred: " + err });
            } else {
              res.render("attendeePoints", {
                memberResults: memberResults,
                houseResults: houseResults,
                searchType: "attendeePointsS",
                filterType: "Slytherin"
              });
            }
          });
        });
      //Will display workshop page
    } else if (nameOfFile == "workshop") {
      workshopCollection.find({}).toArray(function(err, workshopResults) {
        if (err) {
          res.send({ error: " Error is " + err });
        } else {
          res.render("workshop", {
            workshopResults: workshopResults
          });
        }
      });
    } else if (nameOfFile == "events") {
      eventCollection.find({}).toArray(function(err, eventResults) {
        if (err) {
          res.send({ error: " Error is " + err });
        } else {
          res.render("events", {
            eventResults: eventResults
          });
        }
      });
    } else {
      res.render("error");
    }
  });

  //Returns search results based on input from search bar
  app.post("/Element/:searchContents", (req, res) => {
    //Name of file
    let searchContents = req.params.searchContents;

    //Contents from search bar
    let attendeeName = req.body.attendeeName;
    let query = { $regex: attendeeName, $options: "$i" };
    let query2 = { Name: { $regex: attendeeName, $options: "$i" } };

    //Display search results for attendee points page
    if (searchContents == "attendeePoints") {
      memberCollection.aggregate([{ $match: { Name: query } }, { $sort: { Points: -1 } }]).toArray(function(err, memberResults) {
        if (err) {
          res.send({ error: " Error is " + err });
        } else {
          res.render("attendeePoints", {
            memberResults: memberResults,
            searchType: "attendeePoints",
            filterType: "All Houses"
          });
        }
      });
      //Display search results for attendee info page
    } else if (searchContents == "attendeePointsG" || searchContents == "attendeePointsR" || searchContents == "attendeePointsS" || searchContents == "attendeePointsH") {
      let memberContents;
      let searchType;
      let filterType;
      //Will filter by house depending on what page user is on
      if (searchContents == "attendeePointsG") {
        memberContents = memberCollection.aggregate([{ $match: { Name: query, House: "Gryffindor" } }, { $sort: { Points: -1 } }]);
        searchType = "attendeePointsG";
        filterType = "Gryffindor";
      } else if (searchContents == "attendeePointsR") {
        memberContents = memberCollection.aggregate([{ $match: { Name: query, House: "Ravenclaw" } }, { $sort: { Points: -1 } }]);
        searchType = "attendeePointsR";
        filterType = "Ravenclaw";
      } else if (searchContents == "attendeePointsH") {
        memberContents = memberCollection.aggregate([{ $match: { Name: query, House: "Hufflepuff" } }, { $sort: { Points: -1 } }]);
        searchType = "attendeePointsH";
        filterType = "Hufflepuff";
      } else if (searchContents == "attendeePointsS") {
        memberContents = memberCollection.aggregate([{ $match: { Name: query, House: "Slytherin" } }, { $sort: { Points: -1 } }]);
        searchType = "attendeePointsS";
        filterType = "Slytherin";
      }
      memberContents.toArray(function(err, memberResults) {
        if (err) {
          res.send({ error: " Error is " + err });
        } else {
          res.render("attendeePoints", {
            memberResults: memberResults,
            searchType: searchType,
            filterType: filterType
          });
        }
      });
      //Display search results for attendee info page
    } else if (searchContents == "attendeeInfo") {
      memberCollection.find({}).toArray(function(err, houseResults) {
        memberCollection
          .find(query2)
          .sort({ Name: 1 })
          .toArray(function(err, memberResults) {
            if (err) {
              res.send({ error: " Error is " + err });
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
      const id = req.body.id;

      res.render("forms/modifyValuesForm", {
        name: name,
        points: points,
        house: house,
        id: id
      });
    }
  });

  //Update workshop status
  app.post("/Workshop/:id/:workshopName", (req, res) => {
    const workshopName = req.params.workshopName;
    const currentAttendeeID = req.params.id;
    let attendeeContent;

    memberCollection.find({}).toArray(function(err, result) {
      const PhotographyPoints = 50;
      const LearnignPoints = 50;
      const LeadershipPoints = 50;

      for (var i = 0; i < result.length; i++) {
        if (currentAttendeeID == result[i]._id) {
          const attendee = result[i];
          const currentPoint = attendee.Points;

          const attendeeID = { _id: new ObjectID(attendee._id) };

          if (workshopName == "Photography") {
            attendeeContent = {
              $set: {
                Workshop1IsActive: true
              }
            };
          } else if (workshopName == "Learning") {
            attendeeContent = {
              $set: {
                Workshop2IsActive: true
              }
            };
          } else if (workshopName == "Leadership") {
            attendeeContent = {
              $set: { Workshop3IsActive: true }
            };
          }
          memberCollection.updateOne(attendeeID, attendeeContent, (err, item) => {
            if (err) {
              res.send({ "Error is ": +err });
            } else {
              console.log("Workshop status updated!");
            }
          });
          break;
        }
      }
    });
  });

  //Update score for attendee
  app.post("/increasePoints/:id/:points/:house/:redirect", (req, res) => {
    const redirect = req.params.redirect;
    const currentAttendeeID = req.params.id;
    const attendeeHouse = req.params.house;
    let operation = req.body.operation;

    let pointsToAdd = 0;
    if (req.body.points == undefined) {
      pointsToAdd = parseInt(req.params.points);
    } else {
      pointsToAdd = parseInt(req.body.points);
    }

    memberCollection.find({}).toArray(function(err, result) {
      for (var i = 0; i < result.length; i++) {
        if (currentAttendeeID == result[i]._id) {
          const attendee = result[i];
          const currentPoints = parseInt(attendee.Points);
          const attendeeName = attendee.FirstName + " " + attendee.LastName;
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

          console.log(attendeeName + " has " + currentPoints + " points");
          console.log("Adding " + pointsToAdd + " points");
          console.log("Total points should be " + calculatedPoints);

          memberCollection.updateOne(attendeeID, attendeeContent, (err, item) => {
            if (err) {
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

  app.get("*", (req, res) => {
    memberCollection.find({}).toArray(function(err, result) {
      if (err) {
        res.send({ error: " Error is " + err });
      } else {
        res.render("error");
      }
    });
  });
};
