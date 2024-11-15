export const STATUS = {
    INITIAL: "initial",
    LOGGING: "logging",
    WAITING_VIEWER: "waiting",
    PRE_ANSWERING: "preanswering",
    ANSWERING: "answering",
    WAITING_NEXT_QUESTION: "waitingquestion",
    POST_ANSWERING: "postanswering",
};

export const ACTIONS = {
    SET_STATUS: "set_status",
    SET_DATA: "set_data",
    SET_NAME: "set_name",
    SET_SOCKET: "set_socket",
    SET_QUESTION: "set_question"
};

export const initialState = {
    status: STATUS.INITIAL,
    data: { title: null },
    name: "",
    socket: null,
    question: null
};

export function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_STATUS:
            return { ...state, status: action.payload };
        case ACTIONS.SET_DATA:
            return { ...state, data: action.payload };
        case ACTIONS.SET_NAME:
            return { ...state, name: action.payload };
        case ACTIONS.SET_SOCKET:
            return { ...state, socket: action.payload };
        case ACTIONS.SET_QUESTION:
            return { ...state, question: action.payload };
        default:
            return state;
    }
}