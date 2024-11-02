export default function ErrorComponent({ reason }) {
	return (
		<div
			className="w-100 p-2"
			style={{
                position: 'absolute',
                top: 0,
				backgroundColor: "#550000",
				color: "white",
			}}
		>
			{reason}
		</div>
	);
}
