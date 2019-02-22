
var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {



	//Displays home page
	app.get('/', (req, res) => {

		var collection = db.collection("Members");
		var currentNotes = [];

		collection.find({}).toArray(function (err, result) {
			//console.log(result);

			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.render('index', {result: result});
			}
		});
	});

	app.get('/LivePoints', (req, res) => {

		var collection = db.collection("Members");
		var currentNotes = [];

		collection.find({}).toArray(function (err, result) {
			//console.log(result);

			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.render('LivePoints', {result: result});
			}
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
					//The current amount of points that the attendee has
					const currentPoints = parseInt(result[i].Points);

					//The current id of the attendee
					const attendeeID = {'_id': new ObjectID(result[i]._id)};

					//The current house of the attendee
					const currentHouse = result[i].House;

					console.log("Current points: " + currentPoints);
					console.log("Points to add : " + pointsToAdd);

					const attendeeContent = { Name: name, House: currentHouse, Points : currentPoints + pointsToAdd};



					//Update attendee points
					db.collection('Members').update(attendeeID, attendeeContent, (err, item) => {
						if(err) {
							console.log("Error is " + err);
							res.send({ 'Error is ': + err});
						} else {
							console.log('91');
								res.redirect('/increaseHousePoints/' + currentHouse + '/' + pointsToAdd);
						}
					});


					break;
				}

			}
		});









	})

	app.get('/increaseHousePoints/:house/:pointsToAdd', (req, res) => {

		//Update score for attendee house
		const houseName = req.params.house
		const pointsToAdd = req.params.pointsToAdd;
		var currentHousePoints;
		var houseID;

		collection = db.collection("Houses");

		collection.find({}).toArray(function (err, result) {
			console.log('103');
			console.log(result);



			for(var i = 0; i < result.length; i++)
			{
				if(houseName == result[i].Name)
				{
					//Current id of house

					houseID = {'_id': new ObjectID(result[i]._id)};

					//Current points of the house
					currentHousePoints = result[i].Points;


					const totalHousePoints = parseInt(currentHousePoints) + parseInt(pointsToAdd);
					var houseContent = {Name: result[i].Name, Points : totalHousePoints};

					console.log('id:');
					console.log(houseID);
					console.log(houseContent);

				db.collection('Houses').update(houseID, houseContent, (err, item) => {
						if(err) {

							console.log("Error is " + err);
							res.send({ 'Error is ': + err});
						} else {
								console.log("House points updated");
								res.redirect('/LivePoints');
						}
					});

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

			console.log(result[0]);

			db.collection('Members').update(details, note, (err, item) => {
				if(err) {
					res.send({ 'error': ' An error has occurred'});
				} else {
						res.redirect('/LivePoints');
				}
			});
		});
	})

/*
		app.put('/:id/:name/updateNotes', (req, res) => {
			const id = req.params.id;
			const name = req.params.name;

			const note = {content: req.body.content};

			const details = {'_id': new ObjectID(id) };
			db.collection(name).update(details, note, (err, item) => {
				if(err) {
					res.send({ 'error': ' An error has occurred'});
				} else {
						res.redirect('/' + name + '/getNotes');
				}
			});
		});
		*/




};
