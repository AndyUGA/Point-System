
var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {



	//Delete Note based on id
	app.delete('/notes/delete/:id', (req, res) => {
		const id = req.params.id;


		const details = {'_id': ObjectID(id) };

		db.collection('notes').remove(details, (err, item) => {
			if(err) {
				console.log("Error is " + err);
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.redirect('/');
			}
		});
	});




	//Display page to add note to database
	app.get('/addNote', (req, res) => {
		console.log('30 req is ' + req);
		var collection = db.collection("notes");
		var currentNotes = [];

		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('addNote');
			}
		});
	});


	//Displays all notes in database
	app.get('/notes', (req, res) => {

		var collection = db.collection("notes");
		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.send(result);

			}
		});
	});

	//Displays home page
	app.get('/', (req, res) => {

		var collection = db.collection("notes");
		var currentNotes = [];





		collection.find({}).toArray(function (err, result) {
			console.log("result is ");
			console.log(result);



			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('index', {currentNotes: result});
			}


		});


	});

	//Create note
	app.post('/note/create', (req,res) => {

		const note = {  title: req.body.title, content: req.body.content };
		db.collection('notes').insert(note, (err, result) => {
			if(err) {
				res.send({'error': 'An error has occurred'});
			} else {
				res.redirect('/');
			}
		});
	});



	//Get Note based on id
	app.get('/notes/:id', (req, res) => {
		const id = req.params.id;


		const details = {'_id': new ObjectID(id) };
		db.collection('notes').findOne(details, (err, item) => {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.send("Note is " + item.contents);
			}
		});
	});


	//Display modify form
	app.get('/modifyForm/:id', (req, res) => {

		const id = req.params.id;
		//const details = {'_id': new ObjectID(id) };


		res.render('modifyNote', {id : id});
	});


	//Update existing note based on id
	app.put('/notes/:id', (req, res) => {
		const id = req.params.id;
		const note = {  content: req.body.content,title: req.body.title };

		const details = {'_id': new ObjectID(id) };
		db.collection('notes').update(details, note, (err, item) => {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.redirect('/');
			}
		});
	});






	//Create workshop
	app.post('/register/workshop', (req,res) => {

		const note = {  participantName: req.body.participantName,workShopName: req.body.workShopName };
		db.collection('notes').insert(note, (err, result) => {
			if(err) {
				res.send({'error': 'An error has occurred'});
			} else {
				res.redirect('/registration/all');
			}
		});

	});








};
