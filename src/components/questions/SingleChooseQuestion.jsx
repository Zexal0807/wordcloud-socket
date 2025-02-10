import { ResponsiveBar } from "@nivo/bar";

export default function ({ mode, type, question, sendAnswer }) {
	const { options } = question;

	if (type == "sender" && ["quiz","poll"].includes(mode))
		return (
			<div className="w-100 h-100 d-flex justify-content-around align-items-center flex-wrap">
				{options.map((option, key) => (
					<button
						key={key}
						className="col-5 btn btn-success h-25"
						onClick={() => {
							sendAnswer(key);
						}}
					>
						{option.text}
					</button>
				))}
			</div>
		);
		
	let { answers } = question;
	if(answers == undefined)
		answers = [];
	let data = [];
	options.forEach((option) => {
		data.push({ id: option.text, value: 0 });
	});
	answers.forEach((answer) => {
		data[answer.answer].value++;
	});

	if (type == "viewer" && mode == "quiz")
		return <div className="w-100 h-100">
			{answers.length}
		</div>;

	if (type == "viewer" && mode == "poll")
		return (
			<div className="w-100 h-100">
				<ResponsiveBar
					data={data}
					colorBy="indexValue"
					theme={{
						text: {
							fontSize: 20,
						}
					}}
					margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
					axisLeft={null}
					animate={true}
					motionStiffness={90}
					motionDamping={15}
				/>
			</div>
		);

	return <></>;
}
