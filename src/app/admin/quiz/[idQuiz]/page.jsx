"use client"

import { notFound, useParams } from "next/navigation";

const quizs = [
	{ id: 1, name: "quiz 1", description: "Description of quiz 1" },
	{ id: 2, name: "quiz 2", description: "Description of quiz 2" },
	{ id: 3, name: "quiz 3", description: "Description of quiz 3" },
];

export default function QuizDetailPage() {
	const params = useParams();
	const { idQuiz } = params;
	
	const quiz = quizs.find((p) => p.id === parseInt(idQuiz));

	if (!quiz) {
		return notFound();
	}

	return (
		<div style={{ padding: "20px" }}>
			<h1>{quiz.name}</h1>
			<p>{quiz.description}</p>
			<button onClick={() => window.history.back()}>
				Back to quiz
			</button>
		</div>
	);
}
