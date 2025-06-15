import { useState } from "react"

export function Age({ onNext }) {
	const [age, setAge] = useState("");
	const [error, setError] = useState("");
	
	const onContinue = () => {
		if (!age) {
			setError("L'età non può essere vuota.");
			return;
		}
		const numericAge = Number(age);
		if (isNaN(numericAge) || numericAge < 0 || numericAge > 20) {
			setError("Inserisci un numero valido e compreso tra 0 e 20.");
			return;
		}
		setError("");
		onNext(numericAge);
	}

	return (
		<>
			<div className="flex justify-center">
				<h1 className="text-4xl font-bold text-black text-center">
					Inserisci l'età del tuo cane:
				</h1>
			</div>

			<div className="mt-10 pb-8">
				<input
					type="text"
					placeholder="Inserisci un numero"
					className="w-full border-0 border-b-2 border-gray-200 pb-2 text-2xl text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500"
					value={age}
					onChange={e => setAge(e.target.value)}
				/>
				{error && (
					<p className="mt-2 text-sm text-red-500">{error}</p>
				)}
			</div>

			<div className="mt-auto pb-4">
				<button
					type="button"
					onClick={onContinue}
					className="w-full bg-[#A744E6] text-white font-semibold py-4 rounded-full text-base tracking-wide hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
				>
					CONTINUA
				</button>
			</div>
		</>
	)
}