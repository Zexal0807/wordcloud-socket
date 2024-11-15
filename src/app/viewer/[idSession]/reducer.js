export const STATUS = {
	INITIAL: "initial",
	WAITING_SENDERS: "waiting",
    PRE_ANSWERING: "preanswering",
	ANSWERING: "answering",
    POST_ANSWERING: "postanswering",
};

export const ACTIONS = {
	SET_DATA: "set_data",
	SET_SOCKET: "set_socket",
	SET_QUESTION: "set_question",
	SET_STATUS: "set_status",
	ADD_SENDER: "add_sender",
	REMOVE_SENDER: "remove_sender",
	ADD_ANSWER: "add_answer",
};

export const initialState = {
	data: { title: null, senders: [], questions: [], mode: "" },
	socket: null,
	question: -1,
	status: STATUS.INITIAL,
};

export function reducer(state, action) {
	switch (action.type) {
		case ACTIONS.SET_DATA:
			return { ...state, data: action.payload };
		case ACTIONS.SET_SOCKET:
			return { ...state, socket: action.payload };
		case ACTIONS.SET_QUESTION:
			return { ...state, question: action.payload };
		case ACTIONS.SET_STATUS:
			return { ...state, status: action.payload };
		case ACTIONS.ADD_SENDER:
			return {
				...state,
				data: {
					...state.data,
					senders: [...state.data.senders, action.payload],
				},
			};
		case ACTIONS.REMOVE_SENDER:
			return {
				...state,
				data: {
					...state.data,
					senders: state.data.senders.filter((s) => s.id !== action.payload),
				},
			};
		case ACTIONS.ADD_ANSWER:
			const updatedQuestions = [...state.data.questions];
			const questionIndex = action.payload.idQuestion;
			updatedQuestions[questionIndex] = {
				...updatedQuestions[questionIndex],
				answers: [
					...updatedQuestions[questionIndex].answers || [],
					action.payload.data,
				],
			};
			return {
				...state,
				data: { ...state.data, questions: updatedQuestions },
			};
		default:
			return state;
	}
}