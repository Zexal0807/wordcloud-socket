export const metadata = {
	title: "Admin Panel",
	description: "A simple admin panel with login and product management",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<main>{children}</main>
			</body>
		</html>
	);
}
