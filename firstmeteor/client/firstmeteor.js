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

	Chrono = $('.chrono-sprite');
	
	Chrono.walkLeft = function(){
		this.playing = true;
		//var startFrame = -160;
		var width = 22;
		var step = 1;
		var steps = [ -160, -137, -115, -96, -73, -51 ];
		var frames = 5;
		var frame = {top:-195}
		function walk(){
			if( this.playing ){
				var that = this;
				frame.left = steps[ step++ % (frames+1) ];
				this.css( 'backgroundPosition', frame.left + "px " + frame.top + "px" );
				setTimeout(function(){ walk.call(that) }, 800/frames );
			}
		}
		walk.call(this);
	}

	Chrono.stop = function(){
		this.playing = false;
	}

	Chrono.walkLeft();

};
