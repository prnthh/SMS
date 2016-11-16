var bonjour = require('bonjour')()
var stdin = process.openStdin();


console.log("Connected to network. IP Addr: ")
// advertise an HTTP server on port 3000 
var service = bonjour.publish({ name: 'IP Addr', type: 'http', port: 3001 })
 
var browser = bonjour.find({type:'http'})
browser.start()
browser.on('down', function(){
	console.log("IT WORKS")
})

// browse for all http services 
bonjour.find({ type: 'http' }, function (service) {
  console.log('Found an HTTP server:', service)
})

setTimeout(function(){
	service.stop(function(){console.log("K down")})
}, 10000)

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    console.log("you entered: [" + 
        d.toString().trim() + "]");
    process.stdout.write('>');
  });

