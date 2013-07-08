var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {
	"/" 		: requestHandlers.start,
	"/start" 	: requestHandlers.start,
	"/upload"	: requestHandlers.upload,
	"/show"		: requestHandlers.show,
	"/chat"		: requestHandlers.chat,
	"/game"		: requestHandlers.game,
	"/sky"		: requestHandlers.sky,
	"/images/sky"	: requestHandlers.images
};

server.start( router.route, handle );