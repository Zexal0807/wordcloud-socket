export default function LoginPage({ name, setName, join }) {
	return (
		<>
			<h1>MIOQUIZZONE</h1>

			<div className="p-4 bg-light rounded-1">
				<label>Inserisci il tuo nickname</label>
				<input
					className="w-100 text-center rounded-top p-2 border border-secondary"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button
					className="w-100 text-center rounded-bottom p-2 border border-top-0 border-secondary bg-primary text-light"
					onClick={join}
				>
					Cominiciamo
				</button>
			</div>
		</>
	);
}
