// server.js
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
	const server = express();
	const httpServer = createServer(server);

	// Inizializza Socket.IO sul server HTTP
	const io = new Server(httpServer, {
		cors: {
			origin: "*", // Configura il CORS se necessario
			methods: ["GET", "POST"],
		},
	});
	// Memorizza le parole
	let words = [];

	io.on('connection', (socket) => {
		console.log('Un nuovo utente si è connesso');

		socket.on('viewer', () => {
			socket.emit('updateWords', words);
		});

		socket.on('newWord', (word) => {
			words.push(word);
			io.emit('updateWords', words);
		});

		socket.on('disconnect', () => {
			console.log('Un utente si è disconnesso');
		});
	});

	// Gestisci tutte le richieste con Next.js
	server.all("*", (req, res) => {
		return handle(req, res);
	});

	httpServer.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Server pronto su http://localhost:${port}`);
	});
});