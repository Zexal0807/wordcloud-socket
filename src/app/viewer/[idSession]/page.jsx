"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams, redirect } from "next/navigation";

const Viewer = () => {
	const params = useParams();
	const { idSession } = params;

	const [data, setData] = useState({ id: "", title: "" });

	const STATE_NOT_CONNECTED = 0;
	const STATE_CONNECTED = 2;

	const [sessionState, setSessionState] = useState(STATE_NOT_CONNECTED);

	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			await fetch(`./../api/session/${idSession}`)
				.then(async (d) => {
					d = await d.json();
					setData(d);
					setSocket(io("http://localhost:3000"));
				})
				.catch((e) => {
					console.log("SESSIONE NON TROVATA");
					redirect("/?not-found");
				});
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (!socket) return;

		socket.emit("join-session", idSession, { type: "viewer" }, (res) => {
			if (res.status) setSessionState(STATE_CONNECTED);
			if (!res.status) {
				if (res.msg == "full") setSessionState(STATE_SESSION_FULL);
			}
		});
		
		// Other socket events

		return () => {
			if (socket) socket.emit("leave", { type: "viewer", idSession });
		};
	}, [socket]);

	if (sessionState == STATE_NOT_CONNECTED) return <div>NON CONNESSO</div>;
	if (sessionState == STATE_CONNECTED) return <div>{data.title}</div>;
};

export default Viewer;
