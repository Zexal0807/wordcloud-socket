import { FaAngleLeft, FaStop, FaAngleRight } from "react-icons/fa";

import { STATUS } from '@/app/viewer/[idSession]/reducer'

export default function ({ state, prevQuestion, stopQuestion, nextQuestion }) {
    const { status, data, question } = state;

    if([
        STATUS.INITIAL,
        STATUS.WAITING_SENDERS,
        STATUS.PRE_ANSWERING,
        STATUS.END,
    ].includes(status))
        return "";

    let disablePrev = question <= 0 ? (status == STATUS.ANSWERING ? true : false ): false;
    let disableStop = status == STATUS.ANSWERING ? false: true;
    let disableNext = false;

    return (
        <div className="col-12 d-flex p-3">
            <div className="col-2 d-flex justify-content-center align-items-center">
                <FaAngleLeft 
                    onClick={disablePrev ? () => {} : prevQuestion} 
                    color={disablePrev ? "gray" : "black"} 
                    style={data.mode == "quiz" ? { visibility: 'hidden' } : (disablePrev ? {} : {cursor: 'pointer'})}
                    size={25}
                />
                <FaStop 
                    className="mx-2"
                    onClick={disableStop ? () => {} : stopQuestion} 
                    color={disableStop ? "gray" : "black"} 
                    style={disableStop ? {} : {cursor: 'pointer'}}
                    size={15}
                />
                <FaAngleRight 
                    onClick={disableNext ? () => {} : nextQuestion} 
                    color={disableNext ? "gray" : "black"}
                    style={disableNext ? {} : {cursor: 'pointer'}}
                    size={25} 
                />
            </div>

            <div className="col-8"></div>

            <div className="col-2">
                {data.senders.length}
            </div>
        </div>
    )
}