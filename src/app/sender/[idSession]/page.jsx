"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams, useRouter } from "next/navigation";

import "./../../style.css";
import LoginScreen from "@/pages/sender/LoginScreen";
import WaitingScreen from "@/pages/sender/WaitingScreen";
import QuestionScreen from "@/pages/sender/QuestionScreen";
import WaitingNextScreen from "@/pages/sender/WaitingNextScreen";

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
			if (socket) {
				socket.disconnect();
				setSocket(null);
			}
		};
	}, [socket]);

	const sendAnswer = (answer) => {
		socket.emit("send answer", { idQuestion: question.idQuestion, answer });
		if (!question.multipla) {
			setStatus(STATUS_WAITING_NEXT_QUESTION);
		}
	};

	if (status == STATUS_LOGGING)
		return (
			<LoginScreen
				name={name}
				setName={setName}
				join={() => {
					if (name == "") 
						return;
					if (!socket) 
						setSocket(io(process.env.HOST));
				}}
			/>
		);

	return (
		<div className="w-100 h-100 d-flex flex-column">
			<nav className="col-11 col-sm-8 text-center bg-white text-primary rounded-bottom d-flex align-items-center justify-content-center m-auto">
				<h1>{data.title}</h1>
			</nav>
			<div className="py-2">
				<div className="col-11 col-sm-8 h-100 m-auto p-0 bg-white text-primary rounded">
					{status == STATUS_WAITING_VIEWER && <WaitingScreen />}
					{status == STATUS_ANSWERING && <QuestionScreen question={question} sendAnswer={sendAnswer}/>}
					{status == STATUS_WAITING_NEXT_QUESTION && <WaitingNextScreen />}
				</div>
			</div>
		</div>
	);
};

export default Sender;
