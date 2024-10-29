"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (true) {
			let user = {
				name: "Roberto"
			}
			localStorage.setItem("user", JSON.stringify(user));
			router.push("/admin/quiz");
		} else {
			alert("Invalid credentials");
		}
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Email:</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit">Login</button>
			</form>
		</div>
	);
}
