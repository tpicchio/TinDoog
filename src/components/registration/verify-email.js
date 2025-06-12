export function VerifyEmail({ onNext }) {
  return (
	<>
	  {/* Title */}
	  <div className="flex justify-center">
		<h1 className="text-4xl font-bold text-black text-center">
		  Verifica la tua email
		</h1>
	  </div>

	  {/* Verification instructions */}
	  <div className="mt-10">
		<p className="text-lg text-gray-700">
		  Abbiamo inviato un codice di verifica alla tua email. Inseriscilo qui sotto per continuare.
		</p>
		<input
		  type="text"
		  placeholder="Inserisci il codice di verifica"
		  className="w-full border-0 border-b-2 border-gray-200 pb-2 text-2xl placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500 mt-4"
		/>
		<p className="mt-3 text-sm text-gray-500">
		  Se non hai ricevuto il codice, controlla la tua cartella spam o richiedine un altro.
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