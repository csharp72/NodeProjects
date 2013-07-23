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

	chrono = new Chrono('.chrono');
	// chrono.walk('left');

	onFrame(function(){
		chrono.css({
			'left': chrono.x,
			'top': chrono.y
		});
	});

};

var keys = {
	65: 'left',
	68: 'right',
	16: 'run',
	32: 'jump',
}

$(document).ready(function(){
	$(this).on('keydown', function(e){
		console.info( 'keydown=', e.keyCode )
		if( keys[e.keyCode]){
			chrono.sendCmd( keys[e.keyCode], true );
		}
	}).on('keyup', function(e){
		if( keys[e.keyCode]){
			chrono.sendCmd( keys[e.keyCode], false );
		}
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
		this.direction = 'left';
		this.width = 22;
		this.step = 0;
		this.speed = 8;
		this.maxSpeed = 10;
		this.sprite = this.find('.sprite');
		this.cmds = {}

		this.animations = {
			//left, top, width, frames, x-movement, y-movement
			stand: {
				left: [
					[-183, -195, 14],
				],
				right: [
					[-202, -503, 14]
				]
			},
			walk: {
				left : [
					[-163, -195, 15],
					[-138, -195, 21],
					[-119, -195, 14],
					[-100, -195, 14],
					[-73, -195, 22],
					[-55, -195, 14],
				],
				right : [
					[-202, -195, 15],
					[-220, -195, 21],
					[-247, -195, 14],
					[-267, -195, 14],
					[-287, -195, 22],
					[-314, -195, 14],
				]
			},

			run: {
				left : [
					[-163, -195, 15],
					[-120, -305, 28],
					[-119, -195, 14],
					[-100, -195, 14],
					[-88, -305, 28],
					[-55, -195, 14]
				],
				right : [
					[-202, -195, 15],
					[-253, -305, 28],
					[-247, -195, 14],
					[-267, -195, 14],
					[-284, -305, 28],
					[-314, -195, 14],
				]
			},

			jump: {
				left: [
					[-135, -545, 26, 5, 0, 0]
				]
			}
		}

		this.animation = this.animations.stand.left;
		this.playing = true;

		// $chrono.play = function(anim, dir){
		// 	var that = this;
		// 	this.playing = true;
		// 	if( this.animation != this.animations[ anim ][ dir ] ){
		// 		console.log('play', anim)
		// 		this.step = 0;
		// 		this.animation = this.animations[ anim ][ dir ]
		// 	}
		// }

		$chrono.playFrame = function(i){

			if( this.playing && i % 8 == 0 ){

				var modX = 0;
				var modY = 0;
				var anim = 'stand';

				if( this.cmds.left && !this.cmds.right ){
					this.direction = 'left'
					anim = 'walk';
					modX -= 6;
				}
				if( this.cmds.right && !this.cmds.left){
					this.direction = 'right'
					anim = 'walk';
					modX += 6;
				}

				if( this.cmds.run && (this.cmds.left || this.cmds.right) ){
					anim = 'run';
					modX *= 3;
				}

				if( this.cmds.jump ){
					anim = 'jump',
					modY = 3;
				}

				this.animation = this.animations[anim][this.direction] || this.animations[anim].left || this.animations[anim].right
				console.log( this.cmds, anim )
			
				var frames = this.animation.length;
				var frame = this.animation[ this.step++ % frames ]

				//console.log( this.cmds, anim, i, this.animation.length, this.step, frame, this.sprite )

				this.sprite.css({
					'backgroundPosition' : frame[0] + "px " + frame[1] + "px",
					'width' : frame[2]
				});

				this.x += modX;
				this.y += modY;

			}

		}

		$chrono.sendCmd = function(cmd, io){
			this.cmds[cmd] = io;
		}

		$chrono.stop = function(){
			this.playing = false;
		}

		onFrame(function(i){
			$chrono.playFrame(i);
		});

	}).call($chrono);

	return $chrono;

}

