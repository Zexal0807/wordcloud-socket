"use client";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import WordCloud from "../components/WordCloud";

let socket;

function Viewer() {
	const [words, setWords] = useState([]);

	useEffect(() => {
		if (!socket) {
			socket = io("http://localhost:3000");
		}

		// Notifica il server che questo client è un viewer
		socket.emit("viewer");

		// Riceve l'aggiornamento delle parole dal server
		socket.on("updateWords", (newWords) => {
			// Creiamo un oggetto per raggruppare e contare le parole

			const wordCounts = newWords
				.map((word) => word.toUpperCase())
				.reduce((acc, word) => {
					acc[word] = (acc[word] || 0) + 1;
					return acc;
				}, {});

			// Trasformiamo l'oggetto in un array compatibile con il componente WordCloud
			const groupedWords = Object.keys(wordCounts).map((word) => ({
				text: word,
				value: wordCounts[word], // Assegna il conteggio come valore
			}));

			// Aggiorna lo stato con l'array raggruppato
			setWords(groupedWords);
		});
	}, []);

	return (
		<div style={{ textAlign: "center", marginTop: "50px" }}>
			<h1>Word Cloud</h1>
			<div style={{ height: 400, width: 600, margin: "auto" }}>
				<WordCloud
					words={words}
					options={{
						scale: "linear",
						rotations: 2,
						fontSizes: [20, 60],
						rotationAngles: [0, 90],
					}}
				/>
			</div>
		</div>
	);
}

export default Viewer;
