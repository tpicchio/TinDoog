import { useState } from "react";

export function DogName({ value = '', onNext }) {
  const [name, setName] = useState(value);

  const handleContinue = () => {
    if (name.trim().length === 0) {
      alert('Inserisci il nome del tuo cane');
      return;
    }
    onNext(name.trim());
  };

  return (
    <>
      {/* Titolo principale */}
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold text-black text-center">
          Nome del tuo cane
        </h1>
      </div>

      {/* Gruppo per input e testo di aiuto */}
      <div className="mt-10">
        <input
          type="text"
          placeholder="Inserisci il nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-0 border-b-2 border-gray-200 pb-2 text-2xl text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500"
        />
        <p className="mt-3 text-sm text-gray-500">
          Questo è come apparirà in Tindoog e non potrai cambiarlo.
        </p>
      </div>

      {/* Pulsante "CONTINUE" */}
      <div className="mt-auto pb-4">
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
