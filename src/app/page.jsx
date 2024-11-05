"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Cleave from "cleave.js/react";

import ErrorComponent from "./components/ErrorComponent";

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
		<div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-primary">
			{queryMessage ? <ErrorComponent reason={queryMessage} /> : ""}

			<h1>MIOQUIZZONE</h1>

			<div className="p-4 bg-light rounded-1">
				<Cleave
					className="w-100 text-center rounded-top p-2 border border-secondary"
					options={{
						blocks: [4, 4],
						numericOnly: true,
					}}
					onChange={(e) => setCode(e.target.value.replace(" ", ""))}
				/>

				<button
					className="w-100 text-center rounded-bottom p-2 border border-top-0 border-secondary bg-primary text-light"
					onClick={() => {
						if (code.length != 8) 
							return;
						router.push(`/sender/${code}`);
					}}
				>
					ENTRA
				</button>
			</div>
		</div>
	);
}
