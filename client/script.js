
// Quelque fonctions utiles pour la suite.
	function sendMessage(message){
		var message = message.trim();
		if(message == ""){
			console.warn('Message vide. Envoie non autorisé.');
			return;
		}
		socket.emit('message', message);
		displayMessage({pseudo: SESSION.pseudo, content: message, isMe: true});
	}
	function displayMessage (Objmessage) {
		var discuss = document.querySelector('.discuss');
		var p = document.createElement('P');
		var span = document.createElement('SPAN');
		span.className = "name";
		span.innerHTML = Objmessage.pseudo + " : ";
		p.appendChild(span);
		p.innerHTML += Objmessage.content ;
		// On gere laffichage de son propre message différement.
		// En ajoutant un style pour afficher le message sur la droite.
		// if(Objmessage.isMe) {
		// 	p.classList.add('myOwnMessage');	
		// }
		// else{
		// 	// will see later..
		// }
		discuss.appendChild(p);
	}
	function processToSend () {
		var new_message = document.querySelector('.message').value;
		console.log(new_message);
		sendMessage(new_message);
		document.querySelector('.message').value = "";
	}


var SESSION = {};
var socket = io.connect('localhost:1111');
	socket.on('connection_success', (message) => {
		console.log(message);
		do {
			var pseudo = prompt('Entrez un Pseudo de 0 a 16 caractères');
			// Au clic du bouton "cancel".
			if(pseudo == null) break;
		}
		while(pseudo.length < 1 || pseudo.length > 16);

		// Si le bouton "cancel" à été cliqué, ou si une chaine vide à été entrée.
		if(pseudo == null || pseudo.trim() == ""){
			pseudo = "Anonyme";
		}	
		// Maintenant que nous avons un pseudo, on le garde en mémoire global et on l'envoie au serveur.
		SESSION.pseudo = pseudo;
		socket.emit('new_user', pseudo);
	})

	// On gere les messages d'informations que le serveur nous envoie.
	socket.on('info_server_message', (message) => {
		console.log(`Server say : ${message}`);
	})

	// Gestion des différents moyen d'envoyer un message.
	// 1 - En cliquant sur le bouton "Send".
	// 2 - En cliquant sur "Enter" dans l'input de saisie.
	document.querySelector('.btn-send').addEventListener('click', () => {
		processToSend();
	})
	window.addEventListener('keydown', (evt) => {
		if(evt.keyCode == 13) {
			processToSend();
			evt.preventDefault();
		}
	})

	// Reception des nouveaux messages du Chat.
	socket.on('message', (Objmessage) => {
		console.log(Objmessage.pseudo + " : " + Objmessage.content);
		 displayMessage(Objmessage);
	})