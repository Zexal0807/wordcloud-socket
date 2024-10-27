import Link from "next/link";

export default function Home() {
	return (
		<div style={{ padding: "20px" }}>
			<h1>Word Cloud Realtime</h1>
			<nav>
				<Link href="/sender/12345678" style={{ marginRight: "20px" }}>
					Vai a Sender 12345678
				</Link>
				<Link href="/viewer/12345678">
					Vai a Viewer 12345678
				</Link>
			</nav>
		</div>
	);
}
