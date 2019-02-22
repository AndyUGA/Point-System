
var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {



	//Displays home page
	app.get('/', (req, res) => {

		var collection = db.collection("Members");
		var currentNotes = [];

		collection.find({}).toArray(function (err, result) {


			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.render('index', {result: result});
			}
		});
	});

	app.get('/LivePoints', (req, res) => {

		var collection = db.collection("Members");
		var houseResults;


		collection.find({}).toArray(function (err, memberResults) {


			collection = db.collection("Houses");
			collection.find({}).toArray(function (err, result) {
				houseResults = result;


				if(err) {
					res.send({ 'error': ' An error has occurred'});
				} else {


					res.render('LivePoints', {memberResults: memberResults, houseResults: houseResults});
				}
			});



		});
	});

	app.get('/increasePoints/:name/:points', (req, res) => {



		const collection = db.collection("Members");
		const pointsToAdd = parseInt(req.params.points);
		const name = req.params.name;
		collection.find({}).toArray(function (err, result) {


			//Loops through current attendees
			for(var i = 0; i < result.length; i++)
			{


				//Checks name from qrcode against database
				if(name == result[i].Name)
				{
					const attendee = result[i];
					const currentPoints = parseInt(attendee.Points);
					const attendeeID = {'_id': new ObjectID(attendee._id)};
					const attendeeHouse = attendee.House;
					const attendeeContent = { Name: name, House: attendeeHouse, Points : currentPoints + pointsToAdd};

					//Update attendee points
					db.collection('Members').update(attendeeID, attendeeContent, (err, item) => {
						if(err) {
							console.log("Error is " + err);
							res.send({ 'Error is ': + err});
						} else {

								res.redirect('/increaseHousePoints/' + attendeeHouse + '/' + pointsToAdd);
						}
					});
					break;
				}

			}
		});









	})

	//Update score for attendee house
	app.get('/increaseHousePoints/:house/:pointsToAdd', (req, res) => {


		const houseName = req.params.house
		const pointsToAdd = req.params.pointsToAdd;
		const collection = db.collection("Houses");

		collection.find({}).toArray(function (err, result) {


			for(var i = 0; i < result.length; i++)
			{
				const attendee = result[i];
				if(houseName == attendee.Name)
				{

				//Update score for attendee house
				const	houseID = {'_id': new ObjectID(attendee._id)};

				//Current points of the house
				const currentHousePoints = attendee.Points;


				const totalHousePoints = parseInt(currentHousePoints) + parseInt(pointsToAdd);
				const houseContent = {Name: attendee.Name, Points : totalHousePoints};

				db.collection('Houses').update(houseID, houseContent, (err, item) => {
						if(err) {
							console.log("Error is " + err);
							res.send({ 'Error is ': + err});
						} else {

								res.redirect('/LivePoints');
						}
					});

					//Break out of loop if a match is found
					break;
				}

			}


		});
	})







};
