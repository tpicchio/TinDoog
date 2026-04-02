import { useState } from "react";

type BreedSelectionProps = {
  value?: {
    breed?: string;
    gender?: string;
  };
  onNext: (data: { breed: string; gender: string }) => void;
};

export function BreedSelection({ value = {}, onNext }: BreedSelectionProps) {
  const [selectedBreed, setSelectedBreed] = useState(value.breed || "");
  const [customBreed, setCustomBreed] = useState("");
  const [gender, setGender] = useState(value.gender || "");

  const popularBreeds = [
    "Labrador",
    "Pastore Tedesco",
    "Golden Retriever",
    "Bulldog Francese",
    "Beagle",
    "Barboncino",
    "Rottweiler",
    "Yorkshire Terrier",
    "Chihuahua",
    "Boxer",
    "Bassotto",
    "Husky Siberiano",
    "Border Collie",
    "Shih Tzu",
    "Boston Terrier",
    "Maltese",
    "Meticcio",
  ];

  const finalBreed = customBreed.trim() || selectedBreed;
  const isCustomActive = customBreed.trim().length > 0;

  const handleContinue = () => {
    if (!finalBreed) {
      alert("Inserisci la razza del tuo cane");
      return;
    }
    if (!gender) {
      alert("Seleziona il sesso del tuo cane");
      return;
    }
    onNext({ breed: finalBreed, gender });
  };

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold text-black text-center">
          Informazioni sul tuo cane
        </h1>
      </div>

      <div className="mt-10">
        <label className="block text-lg font-medium text-gray-700 mb-3">
          Razza
        </label>

        <select
          value={isCustomActive ? "" : selectedBreed}
          onChange={(e) => {
            setSelectedBreed(e.target.value);
            if (e.target.value) {
              setCustomBreed("");
            }
          }}
          className={`w-full border-2 rounded-lg p-3 text-lg transition-all ${
            isCustomActive
              ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-900 hover:border-purple-300 focus:border-purple-500 focus:outline-none"
          }`}
          disabled={isCustomActive}
        >
          <option value="">Seleziona una razza popolare</option>
          {popularBreeds.map((breedOption) => (
            <option key={breedOption} value={breedOption}>
              {breedOption}
            </option>
          ))}
        </select>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500 bg-white">oppure</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <input
          type="text"
          value={customBreed}
          onChange={(e) => {
            setCustomBreed(e.target.value);
            if (e.target.value.trim()) {
              setSelectedBreed("");
            }
          }}
          placeholder="Scrivi una razza personalizzata"
          className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg text-gray-900 placeholder-gray-400 hover:border-purple-300 focus:border-purple-500 focus:outline-none transition-all"
        />

        {finalBreed && (
          <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded-lg">
            <span className="text-sm text-purple-700">
              Razza selezionata: <strong>{finalBreed}</strong>
            </span>
          </div>
        )}
      </div>

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
              checked={gender === "maschio"}
              onChange={(e) => setGender(e.target.value)}
              className="sr-only"
            />
            <div
              className={`flex items-center justify-center w-full px-6 py-3 rounded-full border-2 transition ${
                gender === "maschio"
                  ? "border-purple-500 bg-purple-500 text-white"
                  : "border-gray-300 text-gray-700 hover:border-purple-500"
              }`}
            >
              <span className="font-medium">Maschio</span>
            </div>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="femmina"
              checked={gender === "femmina"}
              onChange={(e) => setGender(e.target.value)}
              className="sr-only"
            />
            <div
              className={`flex items-center justify-center w-full px-6 py-3 rounded-full border-2 transition ${
                gender === "femmina"
                  ? "border-purple-500 bg-purple-500 text-white"
                  : "border-gray-300 text-gray-700 hover:border-purple-500"
              }`}
            >
              <span className="font-medium">Femmina</span>
            </div>
          </label>
        </div>
      </div>

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
