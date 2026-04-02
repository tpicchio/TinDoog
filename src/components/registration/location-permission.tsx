import { useState } from "react";
import { HiLocationMarker } from "react-icons/hi";

type LocationPermissionProps = {
  onNext: (locationData: {
    latitude: number;
    longitude: number;
    accuracy: number;
  }) => void;
  onCancel: () => void;
};

export function LocationPermission({
  onNext,
  onCancel,
}: LocationPermissionProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState("");

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError("Il tuo browser non supporta la geolocalizzazione");
      return;
    }

    setIsRequesting(true);
    setError("");

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        },
      );

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      console.log("📍 Posizione ottenuta:", locationData);
      onNext(locationData);
    } catch (error) {
      console.error("❌ Errore geolocalizzazione:", error);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError(
            "Permesso negato. La geolocalizzazione è necessaria per trovare altri cani nelle vicinanze.",
          );
          break;
        case error.POSITION_UNAVAILABLE:
          setError(
            "Posizione non disponibile. Controlla le impostazioni del dispositivo.",
          );
          break;
        case error.TIMEOUT:
          setError("Timeout. Riprova più tardi.");
          break;
        default:
          setError("Errore durante il rilevamento della posizione.");
          break;
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold text-black text-center">
          Accesso alla posizione
        </h1>
      </div>

      <div className="mt-10 text-center">
        <div className="flex justify-center mb-6">
          <HiLocationMarker className="text-6xl text-purple-500" />
        </div>

        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            TinDoog ha bisogno di accedere alla tua posizione per:
          </p>

          <ul className="text-left space-y-2 max-w-md mx-auto">
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span className="text-gray-600">
                Trovare altri cani nelle vicinanze
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span className="text-gray-600">
                Mostrare la distanza nei match
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              <span className="text-gray-600">
                Suggerire luoghi per gli incontri
              </span>
            </li>
          </ul>

          <p className="text-sm text-gray-500 mt-4">
            I tuoi dati di posizione sono protetti e utilizzati solo per il
            matching.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}

      <div className="mt-auto pb-4 space-y-3">
        <button
          type="button"
          onClick={requestLocation}
          disabled={isRequesting}
          className="w-full bg-purple-500 text-white font-semibold py-4 rounded-full text-base tracking-wide hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRequesting ? "RILEVAMENTO..." : "CONSENTI ACCESSO"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-gray-200 text-gray-700 font-semibold py-4 rounded-full text-base tracking-wide hover:bg-gray-300 transition"
        >
          NON ORA
        </button>
      </div>
    </>
  );
}
