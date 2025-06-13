export function BreedSelection({ onNext }) {
  return (
	<>
	  {/* Title */}
	  <div className="flex justify-center">
		<h1 className="text-4xl font-bold text-black text-center">
		  Seleziona la razza del tuo cane
		</h1>
	  </div>

	  {/* Breed selection dropdown */}
	  <div className="mt-10">
		<select
		  className="w-full border-0 border-b-2 border-gray-200 pb-2 text-2xl placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500"
		>
		  {/* Add options for breeds here */}
		  <option value="labrador">Labrador</option>
		  <option value="german-shepherd">Pastore Tedesco</option>
		</select>
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
