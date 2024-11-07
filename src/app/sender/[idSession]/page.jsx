"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams, useRouter } from "next/navigation";

import LoginPage from "@/pages/sender/LoginScreen";
import WaitingScreen from "@/pages/sender/WaitingScreen";

const Sender = () => {
	const { idSession } = useParams();
	const router = useRouter();

	const [data, setData] = useState({ title: null });
	const [name, setName] = useState("");
	const [socket, setSocket] = useState();
	const [question, setQuestion] = useState(null);

	const STATUS_INITIAL = "initial";
	const STATUS_LOGGING = "logging";
	const STATUS_WAITING_VIEWER = "waiting";
	const STATUS_ANSWERING = "answering";
	const STATUS_WAITING_NEXT_QUESTION = "waitingquestion";
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
					router.push("/?error=not-found");
				}
			} catch (e) {
				console.log("Errore di rete o altro:", e);
				router.push("/?error=505");
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (!socket) 
			return;

		socket.emit("join-session", idSession, { type: "sender", name }, (res) => {
			if (!res.status) {
				if (res.msg == "full") {
					console.log("SESSIONE NON TROVATA");
					router.push("/?error=full");
				}
			}
			if (res.question) {
				setStatus(STATUS_ANSWERING);
				setQuestion(res.question);
			} else {
				setStatus(STATUS_WAITING_VIEWER);
			}
		});

		socket.on("viewer left", (res) => {
			router.push("/?error=end");
		});

		socket.on("change question", (question) => {
			setQuestion(question);
			setStatus(STATUS_ANSWERING);
		});

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

	const questionPage = () => {
		return (
			<div>
				{question.question}

				<button
					onClick={() => {
						sendAnswer(1);
					}}
				>
					RISPOSTA a
				</button>
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

	switch (status) {
		case STATUS_LOGGING:
			return <LoginPage 
				name={name} 
				setName={setName} 
				join={() => {
					if (name == "") 
						return;
					if (!socket) 
						setSocket(io("http://localhost:3000"));
				}} 
			/>;
		case STATUS_WAITING_VIEWER:
			return <WaitingScreen 
				data={data}
			/>;
		case STATUS_ANSWERING:
			return questionPage();
		case STATUS_WAITING_NEXT_QUESTION:
			return waitingNextPage();
		default:
			return <div>BO</div>;
	}
};

export default Sender;
