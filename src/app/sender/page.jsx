"use client";

import React, { useState } from "react";
import io from "socket.io-client";

let socket;

function Sender() {
	const [newWord, setNewWord] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (newWord) {
			socket.emit("newWord", newWord); // Invia la parola al server
			setNewWord(""); // Resetta l'input
		}
	};

	if (!socket) {
		socket = io("http://localhost:3000");
	}

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
	);
}

export default Sender;
