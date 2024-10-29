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
			question: null,
			questions: [{
				type: "quiz",
				multiple: false,
				question: "Scegli",
				a: { text: "A" },
				b: { text: "A" },
				c: { text: "A" },
				d: { text: "A" },
				answers: []
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

				console.log(`Viewer aggiunto alla sessione ${idSession}`);

				socket.type = "viewer";
				socket.idSession = idSession;

				return saveAndCallback({
					status: true,
					msg: "ok",
					questions: session.questions,
					senders: session.clients.senders
				});
			}
			if (type == "sender") {
				if (session.clients.senders.length >= 50) {
					return callback({ status: false, msg: "full" });
				}

				console.log(`Sender ${clientInfo.name} aggiunto alla sessione ${idSession}`);

				socket.type = "sender";
				socket.idSession = idSession;
				socket.name = clientInfo.name;

				let sender = { id: socket.id, name: socket.name }

				session.clients.senders.push(sender);
				socket.join(idSession);

				socket.to(idSession).emit("sender join", sender);

				return saveAndCallback({
					status: true,
					msg: "ok",
					question: session.question != null ? session.questions[session.question] : null
				});
			}
		});

		socket.on("disconnecting", (reason) => {
			const { idSession, type } = socket;

			if (!idSession)
				return;

			const session = sessions[idSession];

			if (type == "viewer") {
				session.clients.viewers = session.clients.viewers.filter((client) => client.id != socket.id);
				socket.to(idSession).emit("viewer left", socket.id)
			}
			if (type == "sender") {
				session.clients.senders = session.clients.senders.filter((client) => client.id != socket.id);
				socket.to(idSession).emit("sender left", socket.id);
			}

			console.log(`Client ${socket.id} disconnesso dalla sessione ${idSession}`);
			saveSessionToFile(idSession);
		});

		socket.on("change question", (idQuestion) => {
			const { idSession } = socket;

			const session = sessions[idSession];
			session.question = idQuestion;

			if (session) {
				let question = {...session.questions[idQuestion] }
				question.idQuestion = idQuestion;
				question.answers = null;

				io.to(idSession).emit("change question", question);
			}
		});
		/*
		socket.on("send answer", ({ idQuesion, answer }) => {
			debugger;
		
			const session = sessions[idSession];
			if (session) {
				// session.words.push(word);
				io.to(idSession).emit("send answer", { id, ans });
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
			res.json({
				id: session.id,
				title: session.title
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