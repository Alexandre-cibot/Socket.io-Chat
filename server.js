var http = require('http'),
	fs = require('fs');

var server = http.createServer((req, res) => {
	fs.readFile("./index.html", "utf-8", (error, content) => {
		res.writeHead(200, {"content-type":"text/html"});
		res.end(content);
	});
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