import { useState, useEffect, useRef } from "react";

export function VerifyEmail({ email, onNext }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (email && !hasInitialized.current) {
      hasInitialized.current = true;
      sendOTP();
    }
  }, [email]);

  const sendOTP = async () => {
    console.log('🚀 sendOTP chiamata per:', email, 'alle:', new Date().toLocaleTimeString());
    setIsSending(true);
    setError('');

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        if (data.otp) {
          console.log('DEBUG - Codice OTP:', data.otp);
        }
      } else {
        setError(data.message || 'Errore durante l\'invio del codice');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Inserisci il codice di verifica');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: code.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        onNext();
      } else {
        setError(data.message || 'Codice non valido');
      }
    } catch (error) {
      setError('Errore durante la verifica');
    } finally {
      setIsVerifying(false);
    }
  };
  return (
	<>
	  <div className="flex justify-center">
		<h1 className="text-4xl font-bold text-black text-center">
		  Verifica la tua email
		</h1>
	  </div>

	  <div className="mt-10">
		{isSending ? (
		  <p className="text-lg text-gray-700">
		    Stiamo inviando il codice di verifica a <strong>{email}</strong>...
		  </p>
		) : otpSent ? (
		  <p className="text-lg text-gray-700">
		    Abbiamo inviato un codice di verifica a <strong>{email}</strong>. Inseriscilo qui sotto per continuare.
		  </p>
		) : (
		  <p className="text-lg text-red-500">
		    Errore durante l'invio del codice. Ricarica la pagina per riprovare.
		  </p>
		)}
		
		<input
		  type="text"
		  placeholder="Inserisci il codice di verifica"
		  value={code}
		  onChange={(e) => setCode(e.target.value)}
		  disabled={isSending || !otpSent}
		  className="w-full border-0 border-b-2 border-gray-200 pb-2 text-2xl text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-purple-500 mt-4 disabled:opacity-50"
		/>
		
		<div className="mt-3">
		  <p className="text-sm text-gray-500">
		    Se non hai ricevuto il codice, controlla la tua cartella spam.
		  </p>
		  
		  {error && (
		    <p className="text-sm text-red-500 mt-2">{error}</p>
		  )}
		  
		  {otpSent && !isSending && (
		    <button
		      onClick={sendOTP}
		      className="text-sm text-purple-500 hover:text-purple-700 underline font-medium mt-2"
		    >
		      Reinvia codice
		    </button>
		  )}
		</div>
	  </div>

	  <div className="mt-auto pb-4">
		<button
		  type="button"
		  onClick={handleVerify}
		  disabled={isVerifying || isSending || !otpSent || !code.trim()}
		  className="w-full bg-purple-500 text-white font-semibold py-4 rounded-full text-base tracking-wide hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
		>
		  {isVerifying ? 'VERIFICA...' : 'VERIFICA CODICE'}
		</button>
	  </div>
	</>
  );
}
