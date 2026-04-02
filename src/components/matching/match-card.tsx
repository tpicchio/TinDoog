import { HiX, HiHeart, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useState, useEffect } from 'react';

export function MatchCard({ dog, onLike, onPass, isLoading }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = dog.images && dog.images.length > 0 ? dog.images.slice(0, 4) : [];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [dog.id]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!hasMultipleImages) return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevImage();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentImageIndex, hasMultipleImages]);

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="relative w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-blue-500">
        {images.length > 0 ? (
          <>
            <img 
              src={images[currentImageIndex]} 
              alt={`${dog.name} - Foto ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  aria-label="Foto precedente"
                >
                  <HiChevronLeft className="text-white text-lg" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  aria-label="Foto successiva"
                >
                  <HiChevronRight className="text-white text-lg" />
                </button>
              </>
            )}

            {hasMultipleImages && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Vai alla foto ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🐕</div>
              <p className="text-xl font-semibold">{dog.name}</p>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="text-white">
            <div className="flex items-baseline gap-2 mb-2">
              <h2 className="text-4xl font-bold">{dog.name}</h2>
              <span className="text-2xl">{dog.age}</span>
            </div>
            <p className="text-lg opacity-90 mb-2">{dog.breed || 'Razza non specificata'} • {dog.gender}</p>
            <p className="text-base opacity-80">{dog.bio}</p>
            <p className="text-sm opacity-70 mt-3">
              📍 {Math.round(dog.distance)} km away
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-8">
          <button
            onClick={onPass}
            disabled={isLoading}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Non mi piace"
          >
            <HiX className="text-red-500 text-2xl" />
          </button>
          
          <button
            onClick={onLike}
            disabled={isLoading}
            className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Mi piace"
          >
            <HiHeart className="text-white text-3xl" />
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}