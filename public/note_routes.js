
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

	app.get('/increasePoints', (req, res) => {

		var collection = db.collection("Members");


		collection.find({}).toArray(function (err, result) {
			const id = result[0]._id;
			const details = {'_id': new ObjectID(id) };
			const note = {Name: result[0].Name, Points : 1000};

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
