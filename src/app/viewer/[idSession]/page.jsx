"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams, redirect } from "next/navigation";

const Viewer = () => {
	const { idSession } = useParams();

	const [data, setData] = useState({ title: null });

	const STATE_NOT_CONNECTED = 0;
	const STATE_CONNECTED = 2;

	const [sessionState, setSessionState] = useState(STATE_NOT_CONNECTED);

	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try{
				const response = await fetch(`./../api/session/${idSession}`);
				if(response.ok){
					const d = await response.json();
					setData({...d, senders:[], questions:[]});
				}
			}catch(e) {
				console.log("SESSIONE NON TROVATA");
				redirect("/?not-found");
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (!data.title) return;

		if(socket) return;

		const socketInstance = io("http://localhost:3000");
		setSocket(socketInstance);

		socketInstance.emit("join-session", idSession, { type: "viewer" }, (res) => {
			if (!res.status) {
				if (res.msg == "full") setSessionState(STATE_SESSION_FULL);
			}
			if (res.status) {
				setSessionState(STATE_CONNECTED);
				setData((d) => ({...d, senders:res.senders, questions:res.questions}));
			}
		});

		socketInstance.on("join", (res) => {
			setData((d) => ({
				...d,
				senders: [...d.senders, res],
			}));
		});

		socketInstance.on("leave", (res) => {
			setData((d) => ({
				...d,
				senders: [...d.senders.filter(sender => sender.id != res)],
			}));
		});

		// Other socket events

		return () => {
			debugger;
			if (socket) socket.disconnect();
		};
	}, [data.title]);

	if (sessionState == STATE_NOT_CONNECTED) return <div>NON CONNESSO</div>;
	if (sessionState == STATE_CONNECTED)
		return (
			<div>
				<h2>{data.title}</h2>
				<h5>Connessi: {data.senders.map(s => s.name)}</h5>
			</div>
		);
};

export default Viewer;
