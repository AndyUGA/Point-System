
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

					const currentPoints = parseInt(result[i].Points);
					const attendeeID = {'_id': new ObjectID(result[i]._id)};
					const attendeeHouse = result[i].House;
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
				if(houseName == result[i].Name)
				{

				//Update score for attendee house
				const	houseID = {'_id': new ObjectID(result[i]._id)};

				//Current points of the house
				const currentHousePoints = result[i].Points;


				const totalHousePoints = parseInt(currentHousePoints) + parseInt(pointsToAdd);
				const houseContent = {Name: result[i].Name, Points : totalHousePoints};

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




	app.get('/defaultPoints', (req, res) => {

		var collection = db.collection("Members");


		collection.find({}).toArray(function (err, result) {
			const id = result[0]._id;
			const details = {'_id': new ObjectID(id) };
			const note = {Name: result[0].Name, Points : 50};



			db.collection('Members').update(details, note, (err, item) => {
				if(err) {
					res.send({ 'error': ' An error has occurred'});
				} else {
						res.redirect('/LivePoints');
				}
			});
		});
	})




};
