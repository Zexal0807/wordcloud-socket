export default function () {
	return (
		<div className="h-100 d-flex flex-column justify-content-center align-items-center">
			<div
				className="spinner-grow text-primary mb-5"
				style={{ width: "5rem", height: "5rem" }}
				role="status"
			>
				<span className="visually-hidden">Loading...</span>
			</div>
			<h4>In attesa della prossima domanda</h4>
		</div>
	);
}
