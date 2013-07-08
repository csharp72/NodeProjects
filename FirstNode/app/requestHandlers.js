var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

exports.start = function( response ){
	console.log("Request handler 'start' was called.");

	// var body = '<html>'+
	// 	'<head>'+
	// 	'<meta http-equiv="Content-Type" content="text/html; '+ 
	// 	'charset=UTF-8" />'+
	// 	'</head>'+
	// 	'<body>'+
	// 	'<form action="/upload" enctype="multipart/form-data" method="post">'+
	// 	'<input type="file" name="upload">'+
	// 	'<input type="submit" value="Upload File" />'+ 
	// 	'</form>'+
	// 	'</body>'+
	//     '</html>';

	fs.readFile(__dirname + '/index.html', function (err, data) {
		if (err) {
			response.writeHead(500);
			return response.end('Error loading index.html');
		}
		response.writeHead(200);
		response.end(data);
	});

}

exports.game = function( response ){
	fs.readFile(__dirname + '/game.html', function (err, data) {
		if (err) {
			response.writeHead(500);
			return response.end('Error loading index.html');
		}
		response.writeHead(200);
		response.end(data);
	});
}

exports.upload = function( response, request ){
	console.log("Request handler 'upload' was called.");

	var form = new formidable.IncomingForm(); 
	console.log("about to parse");
	form.parse(request, function(error, fields, files) {
	    console.log("parsing done");

	    /* Possible error on Windows systems:
	           tried to rename to an already existing file */
	    fs.rename(files.upload.path, "/tmp/test.png", function(err) { 
	    	if (err) {
	            fs.unlink("/tmp/test.png");
	            fs.rename(files.upload.path, "/tmp/test.png");
	        }
	    });

	    response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();

	});

}

exports.show = function( response ){
	console.log("Request handler 'show' was called.");
	fs.readFile("/tmp/test.png", "binary", function( error, file ){
		if( error ){
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write( err + '\n' );
			response.end();
		}else{
			response.writeHead(200, {'Content-Type': 'image/png'});
			response.write( file, 'binary' );
			response.end();
		}
	})
}

exports.sky = function( response ){
	fs.readFile(__dirname + '/sky.html', function (err, data) {
		if (err) {
			response.writeHead(500);
			return response.end('Error loading index.html');
		}
		response.writeHead(200);
		response.end(data);
	});
}

exports.images = function( response ){
	fs.readFile(__dirname + "/images/sky.jpg", "binary", function( error, file ){
		if( error ){
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write( error + '\n' );
			response.end();
		}else{
			response.writeHead(200, {'Content-Type': 'image/png'});
			response.write( file, 'binary' );
			response.end();
		}
	})
}