"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams, redirect } from "next/navigation";

const Viewer = () => {
	const { idSession } = useParams();

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
					redirect("/?error=not-found");
				}
			} catch (e) {
				console.log("Errore di rete o altro:", e);
				redirect("/?error=505");
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (!data.title) 
			return;

		if (socket) 
			return;

		const socketInstance = io("http://localhost:3000");
		setSocket(socketInstance);

		socketInstance.emit("join-session", idSession, { type: "viewer" }, (res) => {
			if (!res.status) {
				if (res.msg == "full") {
					console.log("SESSIONE NON TROVATA");
						redirect("/?error=full");
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

		// socketInstance.on("send answer", ({id, ans}) => {
		// 	setData((d) => {
		// 		d.questions[id].answers = [...d.questions[id].answers, ans]
		// 		return d
		// 	});
		// });
		// Other socket events

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
			setStatus(STATUS_ANSWERING)
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

	switch (status) {
		case STATUS_WAITING_SENDERS:
			return waitPage();
		case STATUS_ANSWERING:
			return questionPage();
		default:
			return <div>NON CONNESSO</div>
	}
};

export default Viewer;
