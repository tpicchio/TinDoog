import { useState } from "react";
import { useRouter } from 'next/navigation';

export function RegisterEmail({ value = '', onNext }) {
  const [email, setEmail] = useState(value);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const router = useRouter();

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const checkEmailExists = async (emailToCheck) => {
    try {
      setIsChecking(true);
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToCheck }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
      return false;
    } catch (error) {
      console.error('Errore nel controllo email:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleContinue = async () => {
    setError('');
    setEmailExists(false);

    if (!email) {
      setError('Inserisci un\'email');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Inserisci un\'email valida');
      return;
    }

    // Controlla se l'email esiste già
    const exists = await checkEmailExists(email);
    
    if (exists) {
      setEmailExists(true);
      setError('Questa email è già registrata');
      return;
    }

    onNext(email);
  };

  const goToLogin = () => {
    router.push('/login');
  };

  return (
	<>
	  {/* Title */}
	  <div className="flex justify-center">
		<h1 className="text-4xl font-bold text-black text-center">
		  Inserisci la tua email
		</h1>
	  </div>

	  {/* Email input group */}
	  <div className="mt-10">
		<input
		  type="email"
		  placeholder="esempio@email.com"
		  value={email}
		  onChange={(e) => setEmail(e.target.value)}
		  className="w-full border-0 border-b-2 border-gray-200 pb-2 text-2xl text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500"
		/>
		<p className="mt-3 text-sm text-gray-500">
		  Inserisci l'email che vuoi utilizzare per accedere a Tindoog.
		</p>
		
		{/* Messaggio di errore */}
		{error && (
		  <div className="mt-3">
		    <p className="text-sm text-red-500">{error}</p>
		    {emailExists && (
		      <button
		        onClick={goToLogin}
		        className="mt-2 text-sm text-[#A744E6] hover:text-purple-700 underline font-medium"
		      >
		        Vai al login
		      </button>
		    )}
		  </div>
		)}
	  </div>

	  {/* Continue button */}
	  <div className="mt-auto pb-4">
		<button
		  type="button"
		  onClick={handleContinue}
		  disabled={isChecking}
		  className="w-full bg-[#A744E6] text-white font-semibold py-4 rounded-full text-base tracking-wide hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
		>
		  {isChecking ? 'VERIFICA...' : 'CONTINUE'}
		</button>
	  </div>
	</>
  );
}
