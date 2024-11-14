export default function ({ question, sendAnswer }) {
	return (
		<div className="h-100 d-flex flex-column justify-content-center align-items-center">

			<div>
				{question.question}

				<button
					onClick={() => {
						sendAnswer(1);
					}}
				>
					RISPOSTA a
				</button>
			</div>


		</div>
	);
}
