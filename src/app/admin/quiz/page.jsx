"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const quiz = [
	{ id: 1, name: "quiz 1" },
	{ id: 2, name: "quiz 2" },
	{ id: 3, name: "quiz 3" },
];

export default function QuizPage() {
	// const router = useRouter();

  const [user, setUser] = useState({name:""})

	const handleLogout = () => {
		localStorage.removeItem("user");
    redirect("/admin/login");
	};

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
		if (!user) {
			redirect("/admin/login"); // Reindirizza alla login se non autenticato
		}
	}, []);

	return (
		<div style={{ padding: "20px" }}>
			<h1>Benvenuto {user.name}</h1>
      <h1>Elenco Prodotti</h1>
			<ul>
				{quiz.map((quiz) => (
					<li key={quiz.id}>
						<Link href={`/admin/quiz/${quiz.id}`}>{quiz.name}</Link>
					</li>
				))}
			</ul>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}
