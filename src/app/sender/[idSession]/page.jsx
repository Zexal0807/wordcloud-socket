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

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`./../api/session/${idSession}`);
				if (response.ok) {
					const d = await response.json();
					setData({ ...d });
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
		});

		// Other socket events

		return () => {
			if (socket) 
				socket.disconnect();
		};
	}, [socket]);

	if (!socket)
		return (
			<div>
				<input value={name} onChange={(e) => setName(e.target.value)} />
				<button onClick={join}>ENTRA</button>
			</div>
		);


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
	return <div>{data.title}</div>;
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
