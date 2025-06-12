export function DogName({ onNext }) {
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
          placeholder="Tes"
          className="w-full border-0 border-b-2 border-gray-200 pb-2 text-2xl placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500"
        />
        <p className="mt-3 text-sm text-gray-500">
          This is how it will appear in Tindoog and you will not be able to change it.
        </p>
      </div>

      {/* Pulsante "CONTINUE" */}
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