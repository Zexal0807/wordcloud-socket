"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Cleave from "cleave.js/react";

import ErrorComponent from "../components/ErrorComponent";
import Logo from "@/components/Logo";

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

	useEffect(() => {
		document.querySelector("input").inputMode = "numeric";
	}, []);

	return (
		<>
			{queryMessage ? <ErrorComponent reason={queryMessage} /> : ""}
			<div className="w-100 h-100 d-flex flex-column justify-content-start justify-content-sm-center align-items-center">
				<Logo />

				<div className="p-4 bg-light rounded-3 col-11 col-sm-3">
					<Cleave
						className="w-100 text-center rounded-top p-3 p-sm-1 border border-secondary h1 m-0"
						style={{ letterSpacing: "0.2rem" }}
						options={{
							blocks: [4, 4],
							numericOnly: true,
						}}
						onChange={(e) =>
							setCode(e.target.value.replace(" ", ""))
						}
					/>

					<button
						className="w-100 text-center rounded-bottom p-3 border border-top-0 border-secondary bg-primary text-light h4 m-0"
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
		</>
	);
}
