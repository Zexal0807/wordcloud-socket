"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [queryMessage, setQueryMessage] = useState(null);

	useEffect(() => {
		const error = searchParams.get("error");

		if (error) {
			setQueryMessage(error);
			router.replace("/");
		}
	}, [searchParams]);

	return (
		<div style={{ padding: "20px" }}>
			<h1>Word Cloud Realtime</h1>
			<nav>
				<Link href="/sender/12345678" style={{ marginRight: "20px" }}>
					Vai a Sender 12345678
				</Link>
				<Link href="/viewer/12345678">Vai a Viewer 12345678</Link>
			</nav>

			{queryMessage}
		</div>
	);
}
