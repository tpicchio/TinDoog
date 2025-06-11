import React from 'react';

export default function Registrazione() {
  return (
    // Contenitore principale: layout a colonna, altezza schermo, sfondo bianco e padding
    <div className="flex justify-center items-center h-screen w-screen bg-[#AA54EA]">
        <div className="flex flex-col h-9/10 w-1/3 rounded-lg bg-white p-6 font-sans">
        
        {/* Icona di chiusura in alto a sinistra */}
        <div className="self-start">
            <button aria-label="Close" className="text-4xl text-gray-400 hover:text-gray-600">
            ×
            </button>
        </div>

        {/* Contenitore per il contenuto principale con margine superiore */}
        <div className="mt-20">
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
        </div>
        
        {/* Pulsante "CONTINUE" spinto in fondo alla pagina */}
        <div className="mt-auto pb-4">
            <button
            type="button"
            className="w-full bg-[#A744E6] text-white font-semibold py-4 rounded-full text-base tracking-wide hover:bg-purple-700 transition"
            >
            CONTINUE
            </button>
        </div>

        </div>
    </div>
  );
}