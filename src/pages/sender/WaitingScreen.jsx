import Logo from "@/components/Logo";

export default function ({ data }) {
	const { title } = data;
	return (
		<div>
			<Logo />

            <div className="">
                
            </div>

			{title}
			sei in attesa che l host inizi
		</div>
	);
}
