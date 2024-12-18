import "./../../custom-bootstrap.scss";
import BootstrapScript from "../components/BootstrapScript";

export const metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({ children }) {
	return (
		<html lang="it">
			<body
				style={{ width: "100vw", height: "100vh", overflowY: "hidden" }}
			>
				<BootstrapScript />
				<div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-primary">
					{children}
				</div>
			</body>
		</html>
	);
}
