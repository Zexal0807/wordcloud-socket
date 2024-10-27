"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams, redirect } from "next/navigation";

const Sender = () => {
	const params = useParams();
	const { idSession } = params;

	const [data, setData] = useState({ id: "", title: "" });

	const STATE_NOT_CONNECTED = 0;
	const STATE_SESSION_FULL = 1;
	const STATE_CONNECTED = 2;

	const [sessionState, setSessionState] = useState(STATE_NOT_CONNECTED);
	const [name, setName] = useState("");

	const [socket, setSocket] = useState();

	useEffect(() => {
		const fetchData = async () => {
			await fetch(`./../api/session/${idSession}`)
				.then(async (d) => {
					d = await d.json();
					setData(d);
				})
				.catch((e) => {
					console.log("SESSIONE NON TROVATA");
					redirect("/?not-found");
				});
		};
		fetchData();
	}, []);

	const join = () => {
		if (data.id == "" || name == "") return;
		if (!socket)
			setSocket(io("http://localhost:3000"));
	};

	useEffect(() => {
		if (!socket) return;

		socket.emit("join-session", idSession, { type: "sender", name }, (res) => {
				if (res.status) setSessionState(STATE_CONNECTED);
				if (!res.status) {
					if (res.msg == "full") setSessionState(STATE_SESSION_FULL);
				}
			}
		);

		// Other socket events
		
		return () => {
			debugger;
			if (socket) socket.disconnect()
		};
	}, [socket]);

	if (sessionState == STATE_NOT_CONNECTED)
		return (
			<div>
				<input value={name} onChange={(e) => setName(e.target.value)} />
				<button onClick={join}>ENTRA</button>
			</div>
		);

	if (sessionState == STATE_SESSION_FULL)
		return <div>La sessione è piena</div>;

	/*
	const [newWord, setNewWord] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (newWord) {
			socket.emit("newWord", newWord); // Invia la parola al server
			setNewWord(""); // Resetta l'input
		}
	};
*/
	if (sessionState == STATE_CONNECTED) return <div>{data.title}</div>;
	/*
		return (
			<div style={{ textAlign: "center", marginTop: "50px" }}>
				<h1>Invia una Parola</h1>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={newWord}
						onChange={(e) => setNewWord(e.target.value)}
						placeholder="Inserisci una parola"
						style={{ padding: "10px", fontSize: "16px" }}
					/>
					<button
						type="submit"
						style={{ padding: "10px", fontSize: "16px" }}
					>
						Invia
					</button>
				</form>
			</div>
		);*/
};

export default Sender;
