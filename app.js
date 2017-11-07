var mdns = require('multicast-dns')()

var stdin = process.openStdin();
var loggedin = false;
var username;
var db = [];

mdns.on('response', function(response) {
  console.log('got a response packet:', response)
})

mdns.on('query', function(query) {
  if (query.questions[0] && (query.questions[0].name === username || query.questions[0].name === "all")) {
    console.log('got a query packet:', query)
    mdns.respond([{name:username, type:'TXT', data:"kindly"}]) // see below
  }
})


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
                mdns.destroy()
                loggedin = false;
                console.log("Enter your username to begin.");
                process.stdout.write('>');
                break;
            case "who": 
            
                break;
            case "update": 
            
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
                console.log(JSON.stringify(db[db.length-1]))
                mdns.query({
                    questions:[{
                      name: 'all',
                      type: 'TXT',
                    }]
                  }, )
                break;
            case "sendto":
                var recv = data.split(" ")[1]
                console.log("Sent message to "+recv)
                db =  db.concat({"message":data.split(" ").slice(2,data.split(" ").length-1).join() , "time":new Date(), "from":username, "to":recv});
                mdns.query({
                    questions:[{
                      name: recv,
                      type: 'TXT',
                      data: JSON.stringify(db[db.length-1])
                    }]
                  })
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
        console.log("Welcome, "+data)
        username = data;
        loggedin = true;
    }
    callback();
}


initialize();