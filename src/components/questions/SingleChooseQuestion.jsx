export default function ({ mode, type, question, sendAnswer }) {
	if (type == "sender" && mode == "quiz") 
        return (<button
            onClick={() => {
                sendAnswer(1);
            }}
        >
            RISPOSTA a
        </button>
        );

    if (type == "sender" && mode == "pool") 
        return (<button
            onClick={() => {
                sendAnswer(1);
            }}
        >
            RISPOSTA a
        </button>
        );

	if (type == "viewer" && mode == "quiz") 
        return <div className="w-100 h-100">

        </div>;

    if (type == "viewer" && mode == "pool") 
        return <></>;
}
