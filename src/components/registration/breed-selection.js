import { useState } from "react";

export function BreedSelection({ value = {}, onNext }) {
  const [breed, setBreed] = useState(value.breed || '');
  const [gender, setGender] = useState(value.gender || '');

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
    if (!gender) {
      alert('Seleziona il sesso del tuo cane');
      return;
    }
    onNext({ breed, gender });
  };

  return (
	<>
	  {/* Title */}
	  <div className="flex justify-center">
		<h1 className="text-4xl font-bold text-black text-center">
		  Informazioni sul tuo cane
		</h1>
	  </div>

	  {/* Breed selection dropdown */}
	  <div className="mt-10">
		<label className="block text-lg font-medium text-gray-700 mb-3">
		  Razza
		</label>
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

	  {/* Gender selection */}
	  <div className="mt-8">
		<label className="block text-lg font-medium text-gray-700 mb-3">
		  Sesso
		</label>
		<div className="flex gap-4">
		  <label className="flex items-center cursor-pointer">
			<input
			  type="radio"
			  name="gender"
			  value="maschio"
			  checked={gender === 'maschio'}
			  onChange={(e) => setGender(e.target.value)}
			  className="sr-only"
			/>
			<div className={`flex items-center justify-center w-full px-6 py-3 rounded-full border-2 transition ${
			  gender === 'maschio' 
				? 'border-purple-500 bg-purple-500 text-white' 
				: 'border-gray-300 text-gray-700 hover:border-purple-500'
			}`}>
			  <span className="font-medium">Maschio</span>
			</div>
		  </label>
		  
		  <label className="flex items-center cursor-pointer">
			<input
			  type="radio"
			  name="gender"
			  value="femmina"
			  checked={gender === 'femmina'}
			  onChange={(e) => setGender(e.target.value)}
			  className="sr-only"
			/>
			<div className={`flex items-center justify-center w-full px-6 py-3 rounded-full border-2 transition ${
			  gender === 'femmina' 
				? 'border-purple-500 bg-purple-500 text-white' 
				: 'border-gray-300 text-gray-700 hover:border-purple-500'
			}`}>
			  <span className="font-medium">Femmina</span>
			</div>
		  </label>
		</div>
	  </div>

	  {/* Continue button */}
	  <div className="mt-auto pb-4 pt-8">
		<button
		  type="button"
		  onClick={handleContinue}
		  className="w-full bg-purple-500 text-white font-semibold py-4 rounded-full text-base tracking-wide hover:bg-purple-700 transition"
		>
		  CONTINUE
		</button>
	  </div>
	</>
  );
}
