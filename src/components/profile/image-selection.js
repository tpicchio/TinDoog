'use client';

import { useState } from 'react';
import { HiPlus, HiX, HiArrowLeft } from 'react-icons/hi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function ImageSelection({ onComplete }) {
  const [photos, setPhotos] = useState(Array(6).fill(null));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const router = useRouter();

  const uploadToS3 = async (file, presignedUrl) => {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('Errore upload S3');
    }
  };

  const handleFileSelect = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Seleziona solo file immagine');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Immagine troppo grande (max 5MB)');
      return;
    }

    setIsUploading(true);

    try {
      const presignedResponse = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!presignedResponse.ok) {
        throw new Error('Errore generazione URL');
      }

      const { presignedUrl, s3Key } = await presignedResponse.json();

      await uploadToS3(file, presignedUrl);

      const previewUrl = URL.createObjectURL(file);
      const newPhotos = [...photos];
      newPhotos[index] = {
        file,
        preview: previewUrl,
        s3Key,
        uploaded: true
      };
      
      setPhotos(newPhotos);
      
      setUploadedImages(prev => [...prev, { s3Key }]);

    } catch (error) {
      console.error('Errore upload:', error);
      alert('Errore durante il caricamento');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    const photo = newPhotos[index];
    
    if (photo?.preview) {
      URL.revokeObjectURL(photo.preview);
    }
    
    if (photo?.s3Key) {
      setUploadedImages(prev => prev.filter(img => img.s3Key !== photo.s3Key));
    }
    
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const handleContinue = async () => {
    const uploadedPhotos = photos.filter(photo => photo !== null && photo.uploaded);
    
    if (uploadedPhotos.length < 2) {
      alert('Aggiungi almeno 2 foto per continuare');
      return;
    }

    if (uploadedPhotos.length > 6) {
      alert('Massimo 6 foto consentite');
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch('/api/save-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: uploadedPhotos.map(photo => ({
            s3Key: photo.s3Key,
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Errore salvataggio');
      }

      const result = await response.json();
      console.log('Immagini salvate:', result);

      if (onComplete) {
        onComplete(uploadedPhotos);
      } else {
        router.push('/dashboard');
      }

    } catch (error) {
      console.error('Errore salvataggio:', error);
      alert('Errore nel salvataggio delle immagini');
    } finally {
      setIsUploading(false);
    }
  };

  const uploadedCount = photos.filter(photo => photo !== null && photo.uploaded).length;

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center px-4 py-4 border-b">
        <button 
          onClick={() => router.back()} 
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <HiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Aggiungi Foto</h1>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {photos.map((photo, index) => (
            <div key={index} className="aspect-square relative">
              {photo ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={photo.preview}
                    alt={`Photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
                  >
                    <HiX className="w-4 h-4 text-gray-600" />
                  </button>
                  {!photo.uploaded && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {photo.uploaded && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ) : (
                <label className="w-full h-full border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <HiPlus className="w-6 h-6 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileSelect(index, e)}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        <div className="text-center text-gray-600 mb-8">
          <p className="text-sm mb-2">
            {uploadedCount < 2 
              ? `Aggiungi almeno ${2 - uploadedCount} foto per continuare`
              : `${uploadedCount}/6 foto caricate`
            }
          </p>
          <p className="text-xs text-gray-500">
            Formati supportati: JPG, PNG, WEBP (max 5MB)
          </p>
        </div>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={handleContinue}
          disabled={uploadedCount < 2 || uploadedCount > 6 || isUploading}
          className="w-full bg-purple-500 text-white py-4 rounded-xl font-medium text-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
        >
          {isUploading ? 'Salvataggio...' : 'CONTINUE'}
        </button>
      </div>
    </div>
  );
}
