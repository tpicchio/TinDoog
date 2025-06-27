'use client';

import { useState } from 'react';
import { HiPlus, HiX } from 'react-icons/hi';
import Image from 'next/image';

export function ImageSelectionRegistration({ onNext }) {
  const [photos, setPhotos] = useState(Array(6).fill(null));
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      alert('Seleziona solo file immagine');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { 
      alert('Immagine troppo grande (max 5MB)');
      return;
    }

    setIsProcessing(true);

    try {
      // Create local preview URL - NO S3 upload during registration
      const previewUrl = URL.createObjectURL(file);
      
      const newPhotos = [...photos];
      newPhotos[index] = {
        file,
        preview: previewUrl,
        uploaded: true,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      };
      
      setPhotos(newPhotos);

    } catch (error) {
      console.error('Errore elaborazione immagine:', error);
      alert('Errore durante l\'elaborazione dell\'immagine');
    } finally {
      setIsProcessing(false);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    const photo = newPhotos[index];
    
    if (photo?.preview) {
      URL.revokeObjectURL(photo.preview);
    }
    
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const handleNext = () => {
    const validPhotos = photos.filter(photo => photo !== null && photo.uploaded);
    
    if (validPhotos.length < 2) {
      alert('Aggiungi almeno 2 foto per continuare');
      return;
    }

    if (validPhotos.length > 6) {
      alert('Massimo 6 foto consentite');
      return;
    }

    onNext(validPhotos.map(photo => ({
      file: photo.file,
      fileName: photo.fileName,
      fileType: photo.fileType,
      fileSize: photo.fileSize
    })));
  };

  const uploadedCount = photos.filter(photo => photo !== null && photo.uploaded).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Aggiungi le tue foto
        </h2>
        <p className="text-gray-600">
          Carica almeno 2 foto per mostrare il tuo cane agli altri utenti
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <div key={index} className="aspect-square relative">
            {photo ? (
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={photo.preview}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
                  disabled={isProcessing}
                >
                  <HiX className="w-3 h-3 text-gray-600" />
                </button>
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {photo.uploaded && !isProcessing && (
                  <div className="absolute top-1 left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ) : (
              <label className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <HiPlus className="w-4 h-4 text-white" />
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleFileSelect(index, e)}
                  className="hidden"
                  disabled={isProcessing}
                />
              </label>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">
          {uploadedCount < 2 
            ? `Aggiungi almeno ${2 - uploadedCount} foto per continuare`
            : `${uploadedCount}/6 foto pronte`
          }
        </p>
        <p className="text-xs text-gray-500">
          Formati: JPG, PNG, WEBP (max 5MB) • Le foto verranno caricate al completamento della registrazione
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleNext}
          disabled={uploadedCount < 2 || uploadedCount > 6 || isProcessing}
          className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
        >
          {isProcessing ? 'Elaborazione...' : 'Continua'}
        </button>
      </div>
    </div>
  );
}
