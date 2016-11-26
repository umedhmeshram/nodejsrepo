var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');

var app = express();
app.use(bp.json());

var mytasks = [];
var taskid = 1;

app.get('/getmytasks', function(req,res){
	res.json(mytasks)
});

app.get('/getmytasks/:id', function(req,res){
	var taskid = parseInt(req.params.id,10);
	
	/*var matchedTask;
	mytasks.forEach(function(task){
		if(taskid === task.id){ 
			matchedTask = task;
		}
	});*/
	var matchedTask = _.findWhere(mytasks,{id:taskid});
		
	if(matchedTask){
		res.json(matchedTask);
	}else{
		res.status(404).send();
	}
});

app.delete('/deletemytask/:id', function(req,res){
	var taskid = parseInt(req.params.id,10);
	var matchedTask = _.findWhere(mytasks,{id:taskid});
		
	if(!matchedTask){
		res.status(404).json({"error":"id not found"});
	}else{
		mytasks=_.without(mytasks, matchedTask);
		res.json(matchedTask);
	}
});

app.post('/postmytask', function(req,res){
	
	var data = req.body;
	data.id=taskid++;
	mytasks.push(data);
	res.json(data);
});



app.use(express.static('public'));

app.listen(3000, function(){
	
	console.log('app is running on port 3000');
});