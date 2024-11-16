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

	const io = new Server(httpServer, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	const sessions = {};

	const saveSessionToFile = (idSession) => {
		const sessionData = sessions[idSession];
		const filePath = path.join(__dirname, "sessions", `${idSession}.json`);
		if (!fs.existsSync(path.join(__dirname, "sessions"))) {
			fs.mkdirSync(path.join(__dirname, "sessions"));
		}
		fs.writeFileSync(filePath, JSON.stringify(sessionData, null, 2), "utf-8");
	};

	const loadQuiz = (idQuiz) => {
		const filePath = path.join(__dirname, "quiz", `${idQuiz}.json`);
		let quiz = JSON.parse(fs.readFileSync(filePath, "utf-8"));
		quiz.question = null;
		quiz.questions.map(q => ({ ...q, answers: [] }));
		quiz.clients = { viewers: [], senders: [] };
		quiz.id = Math.floor(Math.random() * (99999999 - 10000000) + 10000000);

		sessions[quiz.id] = quiz;

		return quiz;
	}

	io.on("connection", (socket) => {
		console.log("Client connesso");

		socket.on("join-session", (idSession, clientInfo, callback) => {
			const session = sessions[idSession];
			const { type } = clientInfo;

			socket.type = type;
			socket.idSession = idSession;

			let callbackData = {}

			if (type == "viewer") {
				session.clients.viewers.push({ id: socket.id });
				socket.join("v" + idSession);

				console.log(`Viewer aggiunto alla sessione ${idSession}`);

				callbackData = {
					status: true,
					msg: "ok",
					questions: session.questions,
					senders: session.clients.senders
				};
			}
			if (type == "sender") {
				if (session.clients.senders.length >= 50) {
					return callback({ status: false, msg: "full" });
				}

				socket.name = clientInfo.name;
				let sender = { id: socket.id, name: socket.name }

				session.clients.senders.push(sender);
				socket.join("s" + idSession);

				console.log(`Sender ${clientInfo.name} aggiunto alla sessione ${idSession}`);

				socket.to("v" + idSession).emit("sender join", sender);

				callbackData = {
					status: true,
					msg: "ok",
					question: session.question != null ? session.questions[session.question] : null
				};
			}

			saveSessionToFile(idSession);
			return callback(callbackData);
		});

		socket.on("disconnecting", (reason) => {
			const { idSession, type } = socket;

			if (!idSession)
				return;

			const session = sessions[idSession];

			if (type == "viewer") {
				session.clients.viewers = session.clients.viewers.filter((client) => client.id != socket.id);
				socket.to(idSession).emit("viewer left")
				console.log(`Viewer ${socket.id} disconnesso dalla sessione ${idSession}`);
				saveSessionToFile(idSession);
				delete sessions[idSession];
				return;
			}
			if (type == "sender") {
				session.clients.senders = session.clients.senders.filter((client) => client.id != socket.id);
				socket.to("v" + idSession).emit("sender left", socket.id);
				console.log(`Sender ${socket.id} disconnesso dalla sessione ${idSession}`);
			}

			saveSessionToFile(idSession);
		});

		socket.on("change question", (idQuestion) => {
			const { idSession } = socket;

			const session = sessions[idSession];
			session.activeQuestion = idQuestion;
			session.questionTime = new Date();

			if (session) {
				io.to("s" + idSession).emit("change question", {
					...session.questions[idQuestion],
					idQuestion,
					answers: null
				});
			}
		});

		socket.on("start question", (idQuestion) => {
			const { idSession } = socket;

			const session = sessions[idSession];

			if (session) {
				if(session.activeQuestion == idQuestion)
					io.to("s" + idSession).emit("start question", {idQuestion});
				return;
			}
		});

		socket.on("stop question", (idQuestion) => {
			const { idSession } = socket;

			const session = sessions[idSession];

			if (session) {
				if(session.activeQuestion == idQuestion)
					io.to("s" + idSession).emit("stop question", {idQuestion});
				return;
			}
		});

		socket.on("send answer", ({ idQuestion, answer }) => {
			const { id, idSession, name } = socket;
			const session = sessions[idSession];

			if (!session)
				return;

			if (idQuestion != session.activeQuestion)
				return

			let d = (new Date()).getTime() - session.questionTime.getTime();

			if(session.questions[idQuestion].time > 0 ) {
				// C'è un tempo massimo di risposta
				if(d > session.questions[idQuestion].time * 1.05){
					// Siamo oltre del 5% rispetto al tempo
					io.to(id).emit("late answer", {});
					return;
				}
			}

			let a = {
				date: (new Date()).toJSON(),
				time: d,
				sender: { id, name },
				answer
			}
			
			if(session.questions[idQuestion].answers == undefined)
				session.questions[idQuestion].answers = [];

			session.questions[idQuestion].answers.push(a)
			io.to("v" + idSession).emit("send answer", { idQuestion, data: a });
			saveSessionToFile(idSession);
		});

	});

	server.get("/api/session/:idSession", (req, res) => {
		const idSession = req.params.idSession;
		const session = sessions[idSession];

		if (session == undefined)
			res.sendStatus(404)
		else
			res.json({
				id: session.id,
				mode: session.mode,
time: session.time,
				title: session.title
			});
	});

	server.get("/api/quiz/:idQuiz/start", (req, res) => {
		const idQuiz = req.params.idQuiz;

		let quiz = loadQuiz(idQuiz);
		res.json(quiz);
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