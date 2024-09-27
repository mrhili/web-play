'use strict';

const express = require('express');
const bodyParser = require('body-parser')

// App
const app = express();
app.use(bodyParser.json())

const config = {
    // allowEval: false
}

global.users = {
    "admin": {firstName: "The", lastName: "Admin"},
    "bob": {firstName: "Bob", lastName: "Smith"},
}

var findUserByUsername = function (username, callback) {
  if (!users[username])
    return callback(new Error(
      'No user matching '
       + username
      )
    );
  return callback(null, users[username]);
}

function addUser( user ) {	
	Object.assign(users, user);
}

function updateUser(username, prop, value){	
    users[username][prop] = value;
}

app.get("/api/users", (req, res) => {
	return res.status(200).send(users);
});

app.get("/api/users/:username", (req, res) => {
	var username = req.params.username;
	findUserByUsername(username, function(error, user) {
    		if (error) return res.status(404).send('User not found');
    		return res.status(200).send(user);
  	});	
});

app.post("/api/users", (req, res) => {
	var user = JSON.parse(JSON.stringify(req.body));
	addUser(user);
	return res.status(200).send(user);
});

app.put("/api/users/:username", (req, res) => {
	var username = req.params.username;
	var user = JSON.parse(JSON.stringify(req.body));

	for(var attr in user){
		updateUser(username, attr, user[attr]);
	}

	findUserByUsername(username, function(error, user) {
		if (error) return res.status(404).send('User not found');
		return res.status(200).send(user);
  	});	
})

app.post("/api/eval", (req, res) => {
	var body = JSON.parse(JSON.stringify(req.body));
	if (!config.allowEval){
		console.log('allowEval not set!');
		return res.status(403).send();
	}
	console.log("allowEval IS set. RCE on its way...");
	eval(body.code)
	return res.status(200).send();
});


app.listen(3000, '0.0.0.0');
console.log("OK...");