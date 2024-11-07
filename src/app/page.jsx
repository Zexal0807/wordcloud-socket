"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Cleave from "cleave.js/react";

import ErrorComponent from "../components/ErrorComponent";

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

	if (document.querySelector("input"))
		document.querySelector("input").inputMode = "numeric";

	return (
		<>
			{queryMessage ? <ErrorComponent reason={queryMessage} /> : ""}

			<h1>MIOQUIZZONE</h1>

			<div className="p-4 bg-light rounded-1 col-11 col-sm-3">
				<Cleave
					className="w-100 text-center rounded-top p-1 border border-secondary h1 m-0"
					style={{ letterSpacing: "0.2rem"}}
					options={{
						blocks: [4, 4],
						numericOnly: true,
					}}
					onChange={(e) => setCode(e.target.value.replace(" ", ""))}
				/>

				<button
					className="w-100 text-center rounded-bottom p-3 border border-top-0 border-secondary bg-primary text-light"
					onClick={() => {
						if (code.length != 8) return;
						router.push(`/sender/${code}`);
					}}
				>
					ENTRA
				</button>
			</div>
		</>
	);
}
