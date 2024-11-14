"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams, useRouter } from "next/navigation";

import "./../../style.css";

const Viewer = () => {
	const { idSession } = useParams();
	const router = useRouter();

	const [data, setData] = useState({ title: null });
	const [socket, setSocket] = useState(null);
	const [question, setQuestion] = useState(-1);

	const STATUS_INITIAL = "initial";
	const STATUS_WAITING_SENDERS = "waiting";
	const STATUS_ANSWERING = "answering";
	const [status, setStatus] = useState(STATUS_INITIAL);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`./../api/session/${idSession}`);
				if (response.ok) {
					const d = await response.json();
					setData({ ...d, senders: [], questions: [] });
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
		if (!data.title) 
			return;

		if (socket) 
			return;

		const socketInstance = io(process.env.HOST);
		setSocket(socketInstance);

		socketInstance.emit("join-session", idSession, { type: "viewer" }, (res) => {
			if (!res.status) {
				if (res.msg == "full") {
					console.log("SESSIONE NON TROVATA");
					router.push("/?error=full");
				}
			}
			if (res.status) {
				setData((d) => ({
					...d,
					senders: res.senders,
					questions: res.questions,
				}));
				setStatus(STATUS_WAITING_SENDERS);
			}
		});

		socketInstance.on("sender join", (res) => {
			setData((d) => ({
				...d,
				senders: [...d.senders, res],
			}));
		});

		socketInstance.on("sender left", (res) => {
			setData((d) => ({
				...d,
				senders: [...d.senders.filter((sender) => sender.id != res)],
			}));
		});

		socketInstance.on("send answer", ({ idQuestion, data }) => {
			setData((d) => {
				let u = [...d.questions];
				u[idQuestion] = {
					...u[idQuestion],
					answers: [
						...u[idQuestion].answers,
						data
					]
				}
				return { ...d, questions: u};
			});
		});

		return () => {
			if (socket) 
				socket.disconnect();
		};
	}, [data.title]);


	const updateQuestion = (index) => {
		socket.emit("change question", index);
		setQuestion(index);
		if(index < 0 )
			setStatus(STATUS_WAITING_SENDERS);
		else
			setStatus(STATUS_ANSWERING);
	};

	const waitPage = () => {
		return (<div>
				<h2>{data.title}</h2>
				<h5>Connessi: {data.senders.map((s) => s.name)}</h5>
				<>Attendiamo che entrino tutti</>
					<button
						onClick={() => {
							updateQuestion(0);
						}}
					>
						INZIA
					</button>
			</div>
		);
	};

	const questionPage = () => {
		return (
			<div>
				<button
					onClick={() => {
						updateQuestion(question - 1);
					}}
				>
					PREC
				</button>

				{data.questions[question].type}

				<button
					onClick={() => {
						updateQuestion(question + 1);
					}}
				>
					NEXT
				</button>


				{JSON.stringify(data.questions[question])}

			</div>
		);
	};

	return (
		<div className="w-100 h-100 d-flex flex-column">
			<nav className="col-11 col-sm-8 text-center bg-white text-primary rounded-bottom d-flex align-items-center justify-content-center m-auto">
				<h1>{data.title}</h1>
			</nav>
			<div className="py-2">
				<div className="col-11 col-sm-8 h-100 m-auto p-0 bg-white text-primary rounded">
					{status == STATUS_WAITING_SENDERS &&  waitPage()}
					{status == STATUS_ANSWERING &&  questionPage()}
				</div>
			</div>
		</div>
	);
};

export default Viewer;
