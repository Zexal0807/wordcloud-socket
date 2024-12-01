export default function ({ mode, type, question, sendAnswer }) {

    const { options } = question;
    debugger;

	if (type == "sender" && mode == "quiz") 
        return (<button
            onClick={() => {
                sendAnswer(1);
            }}
        >
            RISPOSTA a
        </button>
        );

    if (type == "sender" && mode == "poll") 
        return (<button
            onClick={() => {
                sendAnswer(1);
            }}
        >
            RISPOSTA a
        </button>
        );

	if (type == "viewer" && mode == "quiz") 
        return (<div className="w-100 h-100">
            VQ
        </div>);

    if (type == "viewer" && mode == "poll") 
        return (<div className="w-100 h-100">
            VP
        </div>);

    return <></>;
}
