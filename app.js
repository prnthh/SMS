var bonjour = require('bonjour')()
 
console.log("Connected to network. IP Addr: ")
// advertise an HTTP server on port 3000 
bonjour.publish({ name: 'IP Addr2', type: 'http', port: 3001 })

var browser = bonjour.find({type:'http'})
browser.start()
browser.on('down', function(){
	console.log("IT WORKS")
})

// browse for all http services 
bonjour.find({ type: 'http' }, function (service) {
  console.log('Found an HTTP server:', service)
})