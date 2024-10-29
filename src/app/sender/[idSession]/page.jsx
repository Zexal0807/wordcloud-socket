"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams, redirect } from "next/navigation";

const Sender = () => {
	const params = useParams();
	const { idSession } = params;

	const [data, setData] = useState({ title: null });

	const [name, setName] = useState("");

	const [socket, setSocket] = useState();

	const [question, setQuestion] = useState(null);

	const STATUS_INITIAL = "initial";
	const STATUS_LOGGING = "logging";
	const STATUS_WAITING_VIEWER = "waiting";
	const STATUS_ANSWERING = "answering";
	const STATUS_WAITING_NEXT_QUESTION = "waitingquestion"
	const [status, setStatus] = useState(STATUS_INITIAL);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`./../api/session/${idSession}`);
				if (response.ok) {
					const d = await response.json();
					setData({ ...d });
					setStatus(STATUS_LOGGING);
				} else if (response.status === 404) {
					console.log("SESSIONE NON TROVATA");
					redirect("/?error=not-found");
				}
			} catch (e) {
				console.log("Errore di rete o altro:", e);
				redirect("/?error=505");
			}
		};

		fetchData();
	}, []);

	const join = () => {
		if (name == "") 
			return;
		if (!socket) 
			setSocket(io("http://localhost:3000"));
	};

	useEffect(() => {
		if (!socket) 
			return;

		socket.emit("join-session", idSession, { type: "sender", name }, (res) => {
			if (!res.status) {
				if (res.msg == "full") {
					console.log("SESSIONE NON TROVATA");
					redirect("/?error=full");
				}
			}
			if (res.question) {
				setStatus(STATUS_ANSWERING);
				setQuestion(res.question);
			} else {
				setStatus(STATUS_WAITING_VIEWER);
			}
		});

		// socket.on("viewver left", (res) => { });

		socket.on("change question", (question) => {
			setQuestion(question);
			setStatus(STATUS_ANSWERING);
		});

		// Other socket events

		return () => {
			if (socket) 
				socket.disconnect();
		};
	}, [socket]);

	const sendAnswer = (answer) => {
		socket.emit("send answer", { idQuestion: question.idQuestion, answer })
		if (!question.multipla) { 
			setStatus(STATUS_WAITING_NEXT_QUESTION);
		}
	}

	const loggingPage = () => {
		return (
			<div>
				<input value={name} onChange={(e) => setName(e.target.value)} />
				<button onClick={join}>ENTRA</button>
			</div>
		);
	}

	const questionPage = () => {
		return <div>
			{question.question}

			<button
				onClick={() => {sendAnswer(1)}}
			>RISPOSTA a</button>	
			
		</div>;
	};

	const waitingPage = () => {
		return (
			<div>
				{data.title}
				sei in attesa che l host inizi
			</div>
		);
	};

	const waitingNextPage = () => {
		return (
			<div>
				{data.title}
				Attendiao che tutti rispondano
			</div>
		);
	};

	switch(status){
		case STATUS_LOGGING:
			return loggingPage();
		case STATUS_WAITING_VIEWER:
			return waitingPage();
		case STATUS_ANSWERING:
			return questionPage();
		case STATUS_WAITING_NEXT_QUESTION:
			return waitingNextPage()
		default:
			return <div>BO</div>;
	}
};

export default Sender;
