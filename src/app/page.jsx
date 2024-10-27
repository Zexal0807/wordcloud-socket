// app/page.js
import Link from "next/link";

export default function Home() {
	return (
		<div style={{ padding: "20px" }}>
			<h1>Word Cloud Realtime</h1>
			<nav>
				<Link href="/sender" style={{ marginRight: "20px" }}>
					Vai a Sender
				</Link>
				<Link href="/viewer">Vai a Viewer</Link>
			</nav>
		</div>
	);
}
