var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');

var MongoClient = require('mongodb').MongoClient;

var app = express();
app.use(bp.json());

var mytasks = [];
var taskid = 1;
var db;

MongoClient.connect( 'mongodb://admin:admin@ds111188.mlab.com:11188/umedb', (err, database) => {
			if(err) return console.log(err);
			db = database;
		});

app.get('/getmytasks', function(req,res){
	res.json(mytasks)
});

app.get('/getmytasks/:id', function(req,res){
	var taskid = parseInt(req.params.id,10);
	
	var matchedTask = _.findWhere(mytasks,{id:taskid});
		
	if(matchedTask){
		res.json(matchedTask);
	}else{
		res.status(404).send();
	}
});

app.put('/udpatetask', (req,res) => {
	db.collection('userdb')
		.findOneAndUpdate({name:req.body.name},{
			$set: {
				name: req.body.name,
				email:req.body.email
			}
		},{
			sort: {_id:-1},
			upsert: true
		}, (err, result) =>{
			if(err) return res.send(500,err);
			res.send(200,result);
		});
});

app.delete('/deletemytask', function(req,res){
	db.collection('userdb').findOneAndDelete({name:req.body.name}, (err,result)=> {
		if(err) return res.send(500,err);
		res.send('record deleted : ' + JSON.stringify(result));
	});
});

app.post('/postmytask', function(req,res){
	
	db.collection('userdb').save(req.body, (err,result) => {
		console.log('saved to database');
		res.json(result);
	});
	
});



app.use(express.static('public'));

app.listen(3000, function(){
	
	console.log('app is running on port 3000');
});