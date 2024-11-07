export default function ErrorComponent({ reason }) {

	const messages = {
		"not-found": "La sessione a cui vuoi unirti non è stata trovato, controlla di aver inserito correttamente il codice",
		"full": "La sessione a cui vuoi unirti è attualmente piena, riprova più tardi",
		"505": "Errore 505, stiamo avengo qualche errore con il server, riprova più tardi"
	}

	return (
		<div className="w-100 p-4 bg-danger position-absolute top-0 shadow text-center">
			<p className="h4 text-white">
				{messages[reason] || reason}
			</p>
		</div>
	);
}
