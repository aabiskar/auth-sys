//Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var beerController = require('./controllers/beer');


//Connect to the beerlocker MongoDB
mongoose.connect('mongodb://localhost:27017/beerlocker');

//Create our Express application
var app = express();

//Use the body-parser package in our application
app.use(bodyParser.urlencoded({
	extended:true
}));

//Use environment defined port or 3000
var port = process.env.PORT || 3000;

var router = express.Router();

//Initial dummy routing for testing
//http://localhost:3000/api

router.get('/',function(req,res) {
	res.json({message:'You are running dangerously on low beer!'});
});

//--New code below Here --//

//Create a new route with the prefix /beers
var beersRoute=router.route('/beers');

//Create endpoint /api/beers for POSTS
beersRoute.post(function(req,res) {
	//create the new instance for the Beer model
	var beer = new Beer();

	//Set the beer properties that came from the POST data
	beer.name = req.body.name;
	beer.type = req.body.type;
	beer.quantity = req.body.quantity;

	//Save the beer and check for errors
	beer.save(function(err) {
		if(err)
			res.send(err);

		res.json({message:'Beer added to the locker!',data:beer});
	});
});

beersRoute.get(function(req,res) {
	//Use the beer model to find all beer
	Beer.find(function(err,beers) {
		if(err) res.send(err);

		res.json(beers);

	});
});

//Create a new route with the /beers/:beer_id prefix
var beerRoute = router.route('/beers/:beer_id');

//Create a endpoint /api/beers/:beer_id for GET

beerRoute.get(function(req,res) {
	//Use the Beer model to find a specific beer

	Beer.findById(req.params.beer_id,function(err,beer) {
		if(err)
			res.send(err);

		res.json(beer);
	});
});

//Create a endpoint /api/beers/beer_id for PUT
beerRoute.put(function(req,res) {
	Beer.findById(req.params.beer_id,function(err,beer) {
		if(err) res.send(err);

		//Update the existing beer quantity
		beer.quantity = req.body.quantity;

		//Save the beer and check for errors
		beer.save(function(err) {
			if(err)
				res.send(err);

			res.json(beer);
		});

		
	});
});

//Create endpoint /api/beers/:beer_id for DELETE
beerRoute.delete(function(req,res) {
	//Use the Beer model to find a specific beer and remove it
    Beer.findByIdAndRemove(req.params.beer_id,function(err) {
    	if(err)
    		res.send(err);

    	res.json({message:'Beer removed from the Locker!'});
    });	
});

//Register all of our routes with /api
app.use('/api',router);

//start the server
app.listen(port);
console.log('Insert beer on port' +port);