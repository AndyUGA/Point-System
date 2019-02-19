
var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {








	//Displays home page
	app.get('/', (req, res) => {

		var collection = db.collection("Members");
		var currentNotes = [];

		collection.find({}).toArray(function (err, result) {
			console.log("result is ");
			console.log(result);

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
			console.log("result is ");
			console.log(result);

			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.render('LivePoints', {result: result});
			}
		});
	});












};
