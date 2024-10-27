const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const fs = require("fs");
const path = require("path");
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

	// In-memory storage per le sessioni
	const sessions = {
		'12345678': {
			id: "12345678",
			title: "CIAO",
			questions: [{
				type: "quiz",
				question: "Scegli",
				a: { text: "A", correct: false },
				b: { text: "A", correct: false },
				c: { text: "A", correct: true },
				d: { text: "A", correct: false }
			}],
			clients: {
				senders: [],
				viewers: []
			},
		},
		'1': {
			id: "1",
			title: "CIAO",
			questions: [],
			clients: {
				senders: [],
				viewers: []
			},
		}
	};

	// Funzione per salvare la sessione su un file JSON
	const saveSessionToFile = (idSession) => {
		const sessionData = sessions[idSession];
		const filePath = path.join(__dirname, "sessions", `${idSession}.json`);
		// Crea la cartella sessions se non esiste
		if (!fs.existsSync(path.join(__dirname, "sessions"))) {
			fs.mkdirSync(path.join(__dirname, "sessions"));
		}
		// Scrivi i dati della sessione nel file JSON
		fs.writeFileSync(filePath, JSON.stringify(sessionData, null, 2), "utf-8");
	};

	io.on("connection", (socket) => {
		console.log("Client connesso");

		// Un client si unisce a una sessione specifica
		socket.on("join-session", (idSession, clientInfo, callback) => {
			const session = sessions[idSession];
			const { type } = clientInfo;

			const saveAndCallback = (callbackData) => {
				// Salva la sessione ogni volta che un client si unisce
				saveSessionToFile(idSession);
				return callback(callbackData);
			}

			if (type == "viewer") {
				session.clients.viewers.push({ id: socket.id });
				socket.join(idSession);
				// Invia le parole della sessione corrente al client appena connesso
				// socket.emit("session-words", session.words);

				console.log(`Viewer aggiunto alla sessione ${idSession}`);

				return saveAndCallback({ status: true, msg: "ok" });
			}
			if (type == "sender") {
				if (session.clients.senders.length >= 50) {
					return callback({ status: false, msg: "full" });
				}

				console.log(`Sender ${clientInfo.name} aggiunto alla sessione ${idSession}`);

				session.clients.senders.push({ id: socket.id, name: clientInfo.name });
				socket.join(idSession);
				return saveAndCallback({ status: true, msg: "ok" });
			}
		});

		socket.on("disconnecting", (clientInfo) => {
			debugger;
			let its = socket.rooms.values();
			its.next()
			const idSession = its.next().value;
			if (idSession) {
				const session = sessions[idSession];

				session.clients.senders = session.clients.senders.filter((client) => client.id != socket.id);
				session.clients.viewers = session.clients.viewers.filter((client) => client.id != socket.id);

				console.log(`Client ${socket.id} disconnesso dalla sessione ${idSession}`);
				saveSessionToFile(idSession);
			}
		});

		// Gestione dell'invio di una nuova parola da un sender
		/*
		socket.on("new-word", (sessionId, word) => {
			const session = sessions[sessionId];
			if (session) {
				session.words.push(word);
				io.to(sessionId).emit("update-cloud", word); // Trasmette solo nella stanza della sessione
				saveSessionToFile(sessionId); // Aggiorna il file JSON ogni volta che viene aggiunta una parola
			}
		});
		*/
	});

	server.get("/api/session/:idSession", (req, res) => {
		const idSession = req.params.idSession;
		const session = sessions[idSession];
		if (session == undefined)
			res.sendStatus(404)
		else
			res.json(session);
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