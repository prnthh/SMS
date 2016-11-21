var bonjour = require('bonjour')();
var express = require('express');
var app = express();

var stdin = process.openStdin();
var loggedin = false;
var username;
var db = [];


console.log("Connected to network. IP Addr: ")
// advertise an HTTP server on port 3000 


var browser = bonjour.find({type:'http'})
browser.start()
browser.on('down', function(){
	// console.log("A peer has left the swarm.")
})
browser.on('up', function (s) {
	k = s
	if(s.txt.db!= '' && s.name!=username && username!=null){
		db = uniq(db.concat(JSON.parse(s.txt.db))); 
		if(db[db.length-1].to == username || db[db.length-1].to == 'all')
			console.log("got message: " + db[db.length-1].message)
	}	
})

// browse for all http services 
// bonjour.find({ type: 'http' }, function (service) {
//   console.log('Found an HTTP server:', service)
// })

/*setTimeout(function(){	
	service.stop(function(){console.log("K down")})
}, 10000)*/

function uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

function initialize(){
	console.log("Hi! Enter your username to begin.");
	process.stdout.write('>');
	stdin.addListener("data", function(d) {
	    // note:  d is an object, and when converted to a string it will
	    // end with a linefeed.  so we (rather crudely) account for that  
	    // with toString() and then trim() 
	    repl(d.toString().trim(), function(){process.stdout.write('>')})
	  });
}

function repl(data, callback){
	if(loggedin){
		data = data + " ";
		switch(data.substr(0,data.indexOf(' '))){
			case "stop": console.log("Stopping now")
				service.stop(function(){console.log("K down");
				})
				break;
			case "who": bonjour.find({ type: 'http' }, function (service2) {
				console.log('Online Peers:', service2.name);
				})
				break;
			case "update": bonjour.find({ type: 'http' }, function (service2) {
				console.log(service2.txt.db);
				})
				break;
			case "show":
				for (var i = 0; i < db.length; i++){
					if(db[i].to == username || db[i].to == 'all'){
						console.log("\n"+db[i].message);
						console.log("from:" + db[i].from + "\t\ttime:"+ db[i].time)
					}
				}
				break;
			case "send":
				db =  db.concat({"message":data.substr(data.indexOf(' ')+1), "time":new Date(), "from":username, "to":"all"});
				bonjour.unpublishAll(function(){service = bonjour.publish({ name: username, type: 'http', port: 3001, txt:{'db':JSON.stringify(db[db.length-1])} });})
				break;
			case "sendto":
				var recv = data.split(" ")[1]
				console.log("Sent message to "+recv)
				db =  db.concat({"message":data.split(" ").slice(2,data.split(" ").length-1).join() , "time":new Date(), "from":username, "to":recv});
				bonjour.unpublishAll(function(){service = bonjour.publish({ name: username, type: 'http', port: 3001, txt:{'db':JSON.stringify(db[db.length-1])} });})
				break;
			case "eval":
				console.log(eval(data.substr(data.indexOf(' ')+1)))
				break;
			case "help":
				console.log('Available commands: stop, who, update, show, send, eval')
			case "":
				break;
			default:
				console.log("Command not recognized");
				break;
		}			
	} else {
		service = bonjour.publish({ name: data, type: 'http', port: 3001, txt:{} })
		console.log("Welcome, "+data)
		username = data;
		service.txt = {"db":[]}
		loggedin = true;
	}
	callback();
}

initialize();

