import { useState } from "react";

export function BreedSelection({ value = '', onNext }) {
  const [breed, setBreed] = useState(value);

  const breeds = [
    { value: '', label: 'Seleziona una razza' },
    { value: 'labrador', label: 'Labrador' },
    { value: 'german-shepherd', label: 'Pastore Tedesco' },
    { value: 'golden-retriever', label: 'Golden Retriever' },
    { value: 'bulldog', label: 'Bulldog' },
    { value: 'beagle', label: 'Beagle' },
    { value: 'poodle', label: 'Barboncino' },
    { value: 'rottweiler', label: 'Rottweiler' },
    { value: 'yorkshire', label: 'Yorkshire Terrier' },
    { value: 'chihuahua', label: 'Chihuahua' },
    { value: 'mixed', label: 'Meticcio' },
    { value: 'other', label: 'Altro' }
  ];

  const handleContinue = () => {
    if (!breed) {
      alert('Seleziona una razza');
      return;
    }
    onNext(breed);
  };

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
		  value={breed}
		  onChange={(e) => setBreed(e.target.value)}
		  className="w-full border-0 border-b-2 border-gray-200 pb-2 text-2xl text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500"
		>
		  {breeds.map((breedOption) => (
		    <option key={breedOption.value} value={breedOption.value}>
		      {breedOption.label}
		    </option>
		  ))}
		</select>
	  </div>

	  {/* Continue button */}
	  <div className="mt-auto pb-4 pt-8">
		<button
		  type="button"
		  onClick={handleContinue}
		  className="w-full bg-[#A744E6] text-white font-semibold py-4 rounded-full text-base tracking-wide hover:bg-purple-700 transition"
		>
		  CONTINUE
		</button>
	  </div>
	</>
  );
}
