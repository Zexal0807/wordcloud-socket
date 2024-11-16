"use client";

import React, { useEffect, useReducer } from "react";
import io from "socket.io-client";
import { useParams, useRouter } from "next/navigation";

import { reducer, initialState, ACTIONS, STATUS } from './reducer';

import "./../../style.css";
import WaitingScreen from "@/pages/viewer/WaitingScreen";
import PreAnsweringScreen from "@/pages/viewer/PreAnsweringScreen";

const Viewer = () => {
	const { idSession } = useParams();
	const router = useRouter();
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`./../api/session/${idSession}`);
				if (response.ok) {
					const data = await response.json();
					dispatch({ type: ACTIONS.SET_DATA, payload: { ...data, senders: [], questions: [] } });
					dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.WAITING_SENDERS });
				} else if (response.status == 404) {
					console.log("SESSIONE NON TROVATA");
					router.push("/?error=not-found");
				}
			} catch (e) {
				console.log("Errore di rete o altro:", e);
				router.push("/?error=505");
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (!state.data.title || state.socket) 
			return;

		const socketInstance = io(process.env.HOST);
		dispatch({ type: ACTIONS.SET_SOCKET, payload: socketInstance });

		socketInstance.emit("join-session", idSession, { type: "viewer" }, (res) => {
			if (!res.status && res.msg == "full") {
				console.log("SESSIONE NON TROVATA");
				router.push("/?error=full");
			} else if (res.status) {
				dispatch({
					type: ACTIONS.SET_DATA,
					payload: { ...state.data, senders: res.senders, questions: res.questions },
				});
				dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.WAITING_SENDERS });
			}
		});

		socketInstance.on("sender join", (res) => {
			dispatch({ type: ACTIONS.ADD_SENDER, payload: res });
		});

		socketInstance.on("sender left", (res) => {
			dispatch({ type: ACTIONS.REMOVE_SENDER, payload: res });
		});

		socketInstance.on("send answer", ({ idQuestion, data }) => {
			dispatch({ type: ACTIONS.ADD_ANSWER, payload: { idQuestion, data } });
		});

		return () => {
			if (state.socket) {
				state.socket.disconnect();
				dispatch({ type: ACTIONS.SET_SOCKET, payload: null });
			}
		};
	}, [state.data.title, state.socket]);


	const startQuestion = (index) => {
		state.socket.emit("start question", index);
	}
	const stopQuestion = (index) => {
		state.socket.emit("stop question", index);
	}

	const updateQuestion = (index) => {
		// index è >= 0
		state.socket.emit("change question", index);
		dispatch({ type: ACTIONS.SET_QUESTION, payload: index });
		
		if (state.data.mode == "poll") {
			dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.ANSWERING });
			startQuestion(index);
		}
		if (state.data.mode == "quiz") {
			dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.PRE_ANSWERING });
			setTimeout(()=> {
				dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.ANSWERING });
				startQuestion(index);
				
				let t = state.data.questions[index].time;

				if(t > 0){
					setTimeout(()=> {
						stopQuestion(index);
						dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.POST_ANSWERING });	
					}, t);
				}
			}, 4500);
		}
	};

	const questionPage = () => (
		<div>
			<button onClick={() => {
				if(state.question == 0) return;
				updateQuestion(state.question - 1)
			}}>
				PREC
			</button>
			{state.data.questions[state.question]?.type}
			<button onClick={() => updateQuestion(state.question + 1)}>
				NEXT
			</button>
			{JSON.stringify(state.data.questions[state.question])}

			SE SIAMO IN POOLMODE
			<button onClick={() => stopQuestion(state.question)}>
				STOP
			</button>
		</div>
	);

	return (
		<div className="w-100 h-100 d-flex flex-column">
			<nav className="col-11 col-sm-8 text-center bg-white text-primary rounded-bottom d-flex align-items-center justify-content-center m-auto">
				<h1>{state.data.title}</h1>
			</nav>
			<div className="py-2">
				<div className="col-11 col-sm-8 h-100 m-auto p-0 bg-white text-primary rounded">
					{state.status == STATUS.WAITING_SENDERS && <WaitingScreen 
						state={state} 
						start={() => {
							updateQuestion(0)
						}} 
					/>}
					{state.status == STATUS.PRE_ANSWERING && <PreAnsweringScreen />}
					{state.status == STATUS.ANSWERING && questionPage()}
					{state.status == STATUS.POST_ANSWERING && <div>Ecco i risultati..</div>}
				</div>
			</div>
		</div>
	);
};

export default Viewer;