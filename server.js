var http = require('http'),
	fs = require('fs'),
	htmlFile,
	styleFile,
	styleFile_reset,
	scriptFile;

fs.readFile("./index.html", "utf-8", (error, content) => {
	if(error) {
		throw error;
	}
	htmlFile = content;
});

fs.readFile('./css/reset.css', (error, content) => {
	if(error) {
		throw error;
	}
	styleFile_reset = content;
})

fs.readFile('./css/style.css', (error, content) => {
	if(error) {
		throw error;
	}
	styleFile = content; 
})

fs.readFile('./client/script.js', (error, content) => {
	if(error) {
		throw error;
	}
	scriptFile = content; 
})


var server = http.createServer((req, res) => {
	switch(req.url) {
		case "/css/style.css":
			res.writeHead(200, {"Content-Type": "text/css"});
            res.write(styleFile);
            break;
        case "/css/reset.css":
        	res.writeHead(200, {"Content-Type": "text/css"});
        	res.write(styleFile_reset);
        	break;
       	case "/client/script.js":
        	res.writeHead(200, {"Content-Type": "text/javascript"});
        	res.write(scriptFile);
        	break;
        default :    
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(htmlFile);
	}
	res.end();
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console.
io.sockets.on('connection', (socket) => {
	console.log('Connection d\'un nouvel utilisateur');
	// On informe le client que l'on souhaite avoir son pseudo.
	socket.emit('connection_success', "La connetion au serveur Socket est établie");
	socket.on('new_user', (pseudo) => {
		socket.pseudo = pseudo;
		socket.emit('info_server_message', 'Vous etes enregistré au nom de : ' + pseudo); 
	});

	// Reception d'un nouveau message.
	socket.on('message', (message) => {
		console.log('Un message nous a été envoyer, il faut l\'envoyer au autre client');
		socket.broadcast.emit('message', {pseudo: socket.pseudo, content: message});
	})

})

server.listen(1111);
console.log('Server running ...');