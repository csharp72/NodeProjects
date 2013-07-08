var connected_users=[];

var players = [];
var foods = [];

Array.prototype.pull = function( item ){
	this.splice( this.indexOf(item), 1 );
}

exports.start = function( io ){
	function startFoodDrop(){
		
		setInterval(function(){
	    	var food = {
	    		x: Math.random(),
	    		y: 0,
	    		diameter: 20
	    	}
	    	foods.push( food );
	    }, 4000);

		setInterval(function(){
		    for( var i=0; i<foods.length; i++ ){
		    	var food = foods[i];
		    	food.y += .02;
		    	//console.log('food', food);
		    	if( food.y > 1 ){
		    		foods.pull( food );
		    	}

		    	for( var j=0; j<players.length; j++ ){
		    		var player = players[j];

		    		console.log(player.x, food.x)
		    		if(
		    			player.x * 800 < food.x * 800 + food.diameter 
		    			&& player.x * 800 + player.diameter > food.x * 800
		    			&& player.y * 400 < food.y * 400 + food.diameter
		    			&& player.y * 400 + player.diameter > food.y * 400
		    		){
		    			foods.pull( food );
		    			player.diameter += 10;
		    			io.sockets.emit('update-players', players);
		    		}
		    	}
		    }
		    io.sockets.emit('drop-food', foods);
		}, 300);
	}

	startFoodDrop();
}

exports.player = function( io, socket ){
	var player = {
		id: socket.id,
		x: Math.random(),
		y: Math.random(),
		color: "rgb(" +
			Math.floor( Math.random() * 256 ) + "," +
			Math.floor( Math.random() * 256 ) + "," +
			Math.floor( Math.random() * 256 ) + ")",
		diameter: 50
	}

	socket.on('set nickname', function (name, cb) {
		player['name'] = name;
		players.push( player );

		cb( player );

		socket.emit('start-game', player);

		io.sockets.emit('update-players', players);
	});

	socket.on('player-move', function(x, y){
		player.x = x;
		player.y = y;

		console.log('player= ', player)

		io.sockets.emit('update-players', players);
	});

    socket.on('disconnect', function(reason) {
    	players.pull( player );
    	io.sockets.emit('update-players', players);
    });

}