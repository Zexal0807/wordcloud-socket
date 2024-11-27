import SingleChooseQuestion from "../questions/SingleChooseQuestion";
import QuestionTimer from "../QuestionTimer";

export default function ({ type, state, sendAnswer }) {
	const { data, question } = state;
	const { mode } = data;

	const questionData = data.questions[question];

	const QuestionFactory = (question) => {
		switch(question.type) {
			case "single-choose":
				return <SingleChooseQuestion 
					mode={mode}
					question={question}
					sendAnswer={sendAnswer}
					type={type}
				/>
			default:
				return (<></>);
		}
	};

	return (
		<div className="h-100 d-flex flex-column justify-content-center align-items-center">
			<div
				className="d-flex justify-content-center fs-4 p-2"
				style={{ height: "10%" }}
			>
				Quanti megapixel ha uno schermo di medie dimensione
				{questionData.question}
			</div>
			<div style={{ height: "90%" }}>
				{questionData.time > 0 && type == "viewer" && <QuestionTimer init={questionData.time}/>}
				<QuestionFactory question={questionData}/>
			</div>
		</div>
	);
}
