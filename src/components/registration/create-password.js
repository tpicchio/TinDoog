import { useState } from "react";

export function CreatePassword({ onNext }) {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const handleContinue = () => {
		if (password.length < 8) {
			setError("La password deve essere lunga almeno 8 caratteri.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Le password non coincidono.");
			return;
		}
		setError("");
		onNext(password);
	};

	return (
		<>
			{/* Title */}
			<div className="flex justify-center">
				<h1 className="text-4xl font-bold text-black text-center">
					Crea una password
				</h1>
			</div>

			{/* Password input group */}
			<div className="mt-10">
				<input
					type="password"
					placeholder="Inserisci la tua password"
					className="w-full border-0 border-b-2 border-gray-200 pb-2 text-2xl text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Conferma la tua password"
					className="w-full border-0 border-b-2 border-gray-200 pb-2 text-2xl text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500 mt-6"
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.target.value)}
				/>
				<p className="mt-3 text-sm text-gray-500">
					La password deve essere lunga almeno 8 caratteri.
				</p>
				{error && (
					<p className="mt-2 text-sm text-red-500">{error}</p>
				)}
			</div>

			{/* Continue button */}
			<div className="mt-auto pb-4">
				<button
					type="button"
					onClick={handleContinue}
					className="w-full bg-[#A744E6] text-white font-semibold py-4 rounded-full text-base tracking-wide hover:bg-purple-700 transition"
				>
					CONTINUA
				</button>
			</div>
		</>
	);
}
