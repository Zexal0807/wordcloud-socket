import SingleChooseQuestion from "../questions/SingleChooseQuestion";
import QuestionTimer from "../QuestionTimer/QuestionTimer";

const QuestionFactory = ({ type, mode, question, sendAnswer }) => {
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

export default function ({ type, state, sendAnswer }) {
	const { data, question } = state;
	const { mode } = data;
	const questionData = type == "sender" ? question : data.questions[question];

	return (
		<div className="h-100 d-flex flex-column justify-content-center align-items-center">
			<div
				className="d-flex justify-content-center fs-4 p-2"
				style={{ height: "10%" }}
			>
				{questionData.question}
			</div>
			<div 
				className="w-100"
				style={{ height: "90%" }}
			>
				{mode == "quiz" && questionData.time > 0 && type == "viewer" && <QuestionTimer init={questionData.time}/>}
				<QuestionFactory 
					type={type}
					mode={mode} 
					question={questionData} 
					sendAnswer={sendAnswer}
				/>
			</div>
		</div>
	);
}
