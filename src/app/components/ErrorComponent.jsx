export default function ErrorComponent({ reason }) {
	return (
		<div
			className="w-100 p-2 bg-danger"
			style={{
                position: 'absolute',
                top: 0,
				color: "white",
			}}
		>
			{reason}
		</div>
	);
}
