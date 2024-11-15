export default function ({ start, state}) {
	return (
		<div className="h-100 d-flex flex-column justify-content-center align-items-center">
			<div className="spinner-grow text-primary mb-5" 
				style={{width: "5rem", height: "5rem"}} 
				role="status"
			>
				<span className="visually-hidden">Loading...</span>
			</div>
			<h4>Fate l'accesso tramite il codice</h4>
			<h2>{state.data.id}</h2>

			<button 
				className="btn btn-primary"
				onClick={start}
			>
				Iniziamo
			</button>

			<h5>Utenti connessi:</h5>
			<h6>{state.data.senders.map((s) => s.name)}</h6>
		</div>
	);
}
