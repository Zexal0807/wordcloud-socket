import Logo from "@/components/Logo";

export default function LoginScreen({ state, setName, join }) {
	
	return (
		<>
			<div className="w-100 h-100 d-flex flex-column justify-content-start justify-content-sm-center align-items-center">
				<Logo />

				<div className="p-4 bg-light rounded-3 col-11 col-sm-3">
					<label className="text-center">
						Inserisci il tuo nickname
					</label>
					<input
						className="w-100 text-center rounded-top p-3 p-sm-1 border border-secondary h1 m-0"
						value={state.name}
						onChange={(e) => setName(e.target.value)}
					/>

					<button
						className="w-100 text-center rounded-bottom p-3 border border-top-0 border-secondary bg-primary text-light h4 m-0"
						onClick={join}
					>
						Cominiciamo
					</button>
				</div>
			</div>
		</>
	);
}
