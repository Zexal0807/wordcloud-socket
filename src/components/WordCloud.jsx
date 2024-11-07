"use client";

import { useEffect, useRef } from "react";

export default function WordCloud({ words }) {
	const svgRef = useRef(null);

	// Funzione per calcolare la dimensione della parola in base al numero di occorrenze
	const getFontSize = (value) => {
		const minFontSize = 12;
		const maxFontSize = 50;
		return Math.min(maxFontSize, minFontSize + value * 5);
	};

	return (
		<svg width="500" height="300" ref={svgRef}>
			<g transform="translate(250, 150)">
				{words.map((word, index) => (
					<text
						key={index}
						x={(Math.random() - 0.5) * 200}
						y={(Math.random() - 0.5) * 200}
						fontSize={getFontSize(word.value)}
						fill={`hsl(${Math.random() * 360}, 100%, 50%)`}
						textAnchor="middle"
						style={{ fontFamily: "Arial", fontWeight: "bold" }}
					>
						{word.text}
					</text>
				))}
			</g>
		</svg>
	);
}
