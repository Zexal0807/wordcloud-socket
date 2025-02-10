import { useEffect, useState } from "react";
import "./QuestionTimer.css";

export default function ({ init }) {
	const [time, setTime] = useState(init/1000);
	const [rotation, setRotation] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setTime((prevTime) => prevTime - 1);
			setRotation((prevRotation) => prevRotation - 90);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="container">
			<div
				className="rotatingSquare bg-success"
				style={{ transform: `rotate(${rotation}deg)` }}
			/>
			<div className="timer text-white">
				{time}
			</div>
		</div>
	);
}
