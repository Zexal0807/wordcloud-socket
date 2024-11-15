"use client";

import React, { useEffect, useReducer } from "react";
import io from "socket.io-client";
import { useParams, useRouter } from "next/navigation";

import { reducer, initialState, ACTIONS, STATUS } from './reducer';

import "./../../style.css";
import LoginScreen from "@/pages/sender/LoginScreen";
import WaitingScreen from "@/pages/sender/WaitingScreen";
import QuestionScreen from "@/pages/sender/QuestionScreen";
import WaitingNextScreen from "@/pages/sender/WaitingNextScreen";

const Sender = () => {
	const { idSession } = useParams();
	const router = useRouter();
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`./../api/session/${idSession}`);
				if (response.ok) {
					const data = await response.json();
					dispatch({ type: ACTIONS.SET_DATA, payload: data });
					dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.LOGGING });
				} else if (response.status == 404) {
					router.push("/?error=not-found");
				}
			} catch (e) {
				router.push("/?error=505");
			}
		};

		fetchData();
	}, [idSession, router]);

	useEffect(() => {
		if (!state.socket) 
			return;

		state.socket.emit("join-session", idSession, { type: "sender", name: state.name }, (res) => {
			if (!res.status) {
				if (res.msg == "full") {
					router.push("/?error=full");
				}
			} else if (res.question) {
				dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.ANSWERING });
				dispatch({ type: ACTIONS.SET_QUESTION, payload: res.question });
			} else {
				dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.WAITING_VIEWER });
			}
		});

		state.socket.on("viewer left", () => {
			router.push("/?error=end");
		});

		state.socket.on("change question", (question) => {
			dispatch({ type: ACTIONS.SET_QUESTION, payload: question });
			dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.PRE_ANSWERING });
		});

		state.socket.on("start question", (question) => {
			dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.ANSWERING });
		});

		state.socket.on("stop question", (question) => {
			dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.POST_ANSWERING });
		});

		return () => {
			if (state.socket) {
				state.socket.disconnect();
				dispatch({ type: ACTIONS.SET_SOCKET, payload: null });
			}
		};
	}, [state.socket, idSession, router, state.name]);

	const sendAnswer = (answer) => {
		state.socket.emit("send answer", {
			idQuestion: state.question.idQuestion,
			answer,
		});
		if (!state.question.multipla) {
			dispatch({ type: ACTIONS.SET_STATUS, payload: STATUS.WAITING_NEXT_QUESTION });
		}
	};

	if (state.status == STATUS.LOGGING) {
		return (
			<LoginScreen
				name={state.name}
				setName={(name) =>
					dispatch({ type: ACTIONS.SET_NAME, payload: name })
				}
				join={() => {
					if (state.name) {
						const socket = io(process.env.HOST);
						dispatch({ type: ACTIONS.SET_SOCKET, payload: socket });
					}
				}}
			/>
		);
	}

	return (
		<div className="w-100 h-100 d-flex flex-column">
			<nav className="col-11 col-sm-8 text-center bg-white text-primary rounded-bottom d-flex align-items-center justify-content-center m-auto">
				<h1>{state.data.title}</h1>
			</nav>
			<div className="py-2">
				<div className="col-11 col-sm-8 h-100 m-auto p-0 bg-white text-primary rounded">
					{state.status == STATUS.WAITING_VIEWER && <WaitingScreen />}
					{state.status == STATUS.PRE_ANSWERING && <div>3, 2, 1...</div>}
					{state.status == STATUS.ANSWERING && <QuestionScreen question={state.question} sendAnswer={sendAnswer} />}
					{state.status == STATUS.POST_ANSWERING && <div>Tempo finito ecco il risultato</div>}
					{state.status == STATUS.WAITING_NEXT_QUESTION && <WaitingNextScreen />}
				</div>
			</div>
		</div>
	);
};

export default Sender;