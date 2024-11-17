import { useState, useEffect } from "react";

import './PreAnsweringScreen.css';

export default function () {
	const [count, setCount] = useState(3);

	useEffect(() => {
		if (count >= 0) {

			const timer = setTimeout(() => {
				playSound(); 
				setCount(count - 1);
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [count]);

	const playSound = () => {
		const audio = new Audio("/sound/beep.mp3");
		audio.volume = 0.8;
		audio.play();
	};

	return (
		<div className="h-100 d-flex flex-column justify-content-center align-items-center">
			
			<div className="countContainer">
				<h1 className={`count animate-text`}>
					{count >= 0 ? count : ""}
				</h1>
				<h1 className={`count`}>
					{count > 0 ? count : 0}
				</h1>
			</div>
		</div>
	);
}
