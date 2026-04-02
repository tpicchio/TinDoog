export function LoadingScreen({ message = "Caricamento..." }) {
	return (
		<div className="flex justify-center items-center h-screen w-screen bg-purple-500">
			<div className="flex flex-col items-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
				<p className="mt-4 text-white text-center">{message}</p>
			</div>
		</div>
	);
}
