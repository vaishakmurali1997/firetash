/**
 * Developed by Vaishak Muarli
 */

// Adding required modules.  
var express = require('express');
var app = express();
const server = require('http').createServer(app);
var io = require('socket.io').listen(server); 

// Initializing variables 
var classic = [];
var premium = [];
var vip = [];
var revenue = 0; 

// Setting up port for server. 
server.listen(process.env.PORT || 3000);
console.log("Server is listening...");

app.use(express.static('public'));

// response to send index html (bookings page)
app.get('/', function(req, res){
    res.sendFile(__dirname + "/bookingportal.html"); 
});

// response to send admin html (dashboard)
app.get('/admin', function(req, res){
    res.sendFile(__dirname + "/admin.html"); 
});

// socket at the event of connection
io.sockets.on('connection',(socket)=> {
    socket.on('disconnect', ()=> { 
        console.log("Sockets Disconnected!!");
    });
    
    // when booking is placed 
    socket.on('booking placed', (data) =>{        
        // Trigger confirmation event. 
        io.sockets.emit('confirmation',data);
    }); 

    // report to be sent to dashboard
    socket.on('send report', (data)=>{
        var seatInfo = data.seat; 
        var numberOfPeople = parseInt(data.nop); 
        var bookingName = data.name; 

        if(seatInfo == "1") {
            classic.push(bookingName); 
            revenue += 300 * numberOfPeople;
        }else if (seatInfo == "2"){
            premium.push(bookingName); 
            revenue += 750 * numberOfPeople;
        }else if(seatInfo == "3"){
            vip.push(bookingName);
            revenue += 1500 * numberOfPeople;
      }
     
        // Data to be sent to the admin portal. 
        io.sockets.emit('sent',{
            classicSeat: classic.length, 
            premiumSeat: premium.length,
            vipSeat: vip.length,
            currentBoookings: (classic.length + premium.length + vip.length),
            revenue: revenue
         }); 
    })
})

