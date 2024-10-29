"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));

		if (user) {
			router.push("/admin/quiz"); // Se autenticato, vai all'elenco prodotti
		} else {
			router.push("/admin/login"); // Altrimenti, vai alla pagina di login
		}
	}, [router]);

	return null; // Non serve un contenuto visibile per questa pagina
}
