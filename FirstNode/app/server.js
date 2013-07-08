var http = require("http");
var url = require("url");
var sio = require("socket.io");
var game = require("./game");

exports.start = function( route, handle ) {

	function onRequest(request, response) {
		var pathname = url.parse( request.url ).pathname;
		if( pathname != '/favicon.ico' ){
			console.log("Request for " + pathname + " received.");

			route( handle, pathname, response, request, io );

		}
	}

	var app = http.createServer(onRequest).listen(8888);

	var io = sio.listen(app, { log: false });
	
	var chatlog = [];

	game.start( io );
	
	io.sockets.on('connection', function (socket) {
		
		

		//socket.set('player', player);

		game.player( io, socket );


		

		

		// socket.emit('update-chat', { chatlog: chatlog });

		// socket.on('chat', function (data) {
		// 	console.log('Recieved data ', data);
		// 	if( data.msg.length ){
		// 		chatlog.push( data.msg );
		// 		io.sockets.emit('update-chat', { chatlog: chatlog });
		// 	}
		// });

		// socket.on('clear-chat', function(){
		// 	io.sockets.emit('clear-chat');
		// });


	});
	
	console.log("Server has started.");
}

