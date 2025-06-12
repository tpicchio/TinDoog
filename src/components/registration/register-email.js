export function RegisterEmail({ onNext }) {
  return (
	<>
	  {/* Title */}
	  <div className="flex justify-center">
		<h1 className="text-4xl font-bold text-black text-center">
		  Inserisci la tua email
		</h1>
	  </div>

	  {/* Email input group */}
	  <div className="mt-10">
		<input
		  type="email"
		  placeholder=""
		  className="w-full border-0 border-b-2 border-gray-200 pb-2 text-2xl placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500"
		/>
		<p className="mt-3 text-sm text-gray-500">
		  Inserisci l'email che vuoi utilizzare per accedere a Tindoog.
		</p>
	  </div>

	  {/* Continue button */}
	  <div className="mt-auto pb-4">
		<button
		  type="button"
		  onClick={onNext}
		  className="w-full bg-[#A744E6] text-white font-semibold py-4 rounded-full text-base tracking-wide hover:bg-purple-700 transition"
		>
		  CONTINUE
		</button>
	  </div>
	</>
  );
}