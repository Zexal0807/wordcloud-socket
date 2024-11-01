"use client";

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

	const [code, setCode] = useState("");

	return (
		<div
			className="w-100 h-100"
			style={{backgroundColor: "#e491da"}}
		>
			<div
				className="w-100 p-2"
				style={{
					backgroundColor: "#550000",
					color: "white",
				}}
			>
				{queryMessage}
			</div>

			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				<h1>MIOQUIZZONE</h1>

				<div
					style={{
						backgroundColor: "white",
						borderRadius: 5,
						padding: 10,
					}}
				>
					<input
						style={{ width: "100%", fontSize: 20 }}
						value={code}
						onChange={(e) => setCode(e.target.value)}
					/>
					<button
						style={{ width: "100%", backgroundColor: "#e491da" }}
						onClick={() => {
							if (code.length != 8) return;
							router.push(`/sender/${code}`);
						}}
					>
						ENTRA
					</button>
				</div>
			</div>
		</div>
	);
}
