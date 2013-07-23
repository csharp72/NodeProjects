Template.hello.greeting = function () {
	if( Meteor.userId() ){
		return 'userId = ', Meteor.userId();
	}else{
		return 'Welcome. Please log in.';
	}
};

Template.hello.events({
	'click input' : function () {
		// template data, if any, is available in 'this'
		if (typeof console !== 'undefined')
			console.log("You pressed the button");
		}
});

Template.chrono.rendered = function(){

	chrono = new Chrono('.chrono-sprite');
	chrono.walk('left');

	onFrame(function(){
		chrono.css({
			'left': chrono.x,
			'top': chrono.y
		});
	});



};

$(document).ready(function(){
	var keys = {
		65: 'left',
		68: 'right',
		87: 'up',
		83: 'down'
	}
	$(this).on('keydown', function(e){
		console.log( e.keyCode, keys[e.keyCode] )
		keys[e.keyCode] && chrono.walk(keys[e.keyCode]);
	}).on('keyup', function(e){
		chrono.stop();
	})
});

var Loop = function( startRightAway ){
	var that = $(this);
	that.frame = 1; 
	that.frameRate = 60;
	that.running = false;
	that.funcsToRun = [];

	that.start = function(){
		that.running = true;
		that.tick();
	}

	that.tick = function(){
		setTimeout(function(){
			if( that.running ){
				that.trigger( 'frame' );
				$.each(that.funcsToRun, function(i, func){
					func( that.frame );
				});
				that.tick();
				that.frame++;
			}
		}, 1000/that.frameRate);
	}

	startRightAway && that.start();
	return that;
}

var loop = new Loop(true);

function onFrame(cb){
	loop.funcsToRun.push(cb);
}

var Chrono = function(selector){
	var $chrono = $(selector);

	(function(){

		this.x = 800;
		this.y = 0;
		this.direction = null;
		this.width = 22;
		this.step = 1;
		this.speed = 8;
		this.maxSpeed = 10;

		$chrono.walk = function(dir){
			var that = this;
			this.direction = dir;
			this.playing = true;
		}

		$chrono.playFrame = function(dir){
			var steps = {
				left: [ -160, -137, -115, -96, -73, -51 ],
				right: [ -198, -220, -242, -263, -287, -309 ],
				up: [ -160, -137, -115, -96, -73, -51 ],
				down: [ -199, -220, -242, -263, -287, -309 ]
			}
			var movement = {
				left: ['x', -6],
				right: ['x', 6],
				up: ['y', -6],
				down: ['y', 6]
			}
			var frames = steps[dir].length;
			var frame = {top:-195}

			if( this.playing ){
				frame.left = steps[dir][ this.step++ % frames ];
				this.css( 'backgroundPosition', frame.left + "px " + frame.top + "px" );
				this[movement[dir][0]] += movement[dir][1];
			}

		}

		$chrono.stop = function(){
			this.playing = false;
		}

		onFrame(function(i){
			if( i % ($chrono.maxSpeed+1 - $chrono.speed) == 0 )
				$chrono.playFrame( $chrono.direction );
		});

	}).call($chrono);

	return $chrono;

}

