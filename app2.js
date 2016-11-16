var bonjour = require('bonjour')()
var stdin = process.openStdin();
var loggedin = false;

console.log("Connected to network. IP Addr: ")
// advertise an HTTP server on port 3000 


var browser = bonjour.find({type:'http'})
browser.start()
browser.on('down', function(){
	console.log("MAN DOWN I REPEAT MAN DOWN")
})
browser.on('up', function(){
	console.log("I SPY A CHEEKY BEGGA")
})

// browse for all http services 
// bonjour.find({ type: 'http' }, function (service) {
//   console.log('Found an HTTP server:', service)
// })

/*setTimeout(function(){
	service.stop(function(){console.log("K down")})
}, 10000)*/

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
		switch(data){
			case "stop": console.log("Stopping now")
				service.stop(function(){console.log("K down");callback();})
				break;
			case "who": bonjour.find({ type: 'http' }, function (service) {
				console.log('Services available:', service);
				callback();
				})
				break;
			default:
				console.log("Command not recognized");
				callback();
				break;
		}			
	} else {
		service = bonjour.publish({ name: data, type: 'http', port: 3001 })
		console.log("Welcome, "+data)
		loggedin = true;
		callback();
	}

	
}

initialize();