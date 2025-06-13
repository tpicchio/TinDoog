'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { IoIosArrowBack } from 'react-icons/io'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email o password non corretti')
      } else {
        router.push('/dashboard') // Reindirizza alla home
      }
    } catch (error) {
      setError('Errore durante il login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="self-start">
			<button
				aria-label="Back"
				className="text-4xl text-gray-400 hover:text-gray-600"
				onClick={() => {
					window.location.href = '/';
				}}
			>
				<IoIosArrowBack />
			</button>
		</div>

        {/* Titolo */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Inserisci i tuoi dati
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Email */}
          <div>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 bg-transparent text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Campo Password */}
          <div>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 bg-transparent text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Messaggio di errore */}
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Bottone Accedi */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-500 text-white py-3 px-4 rounded-full font-medium hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>

        {/* Link registrazione */}
        <div className="mt-6 text-center">
          <span className="text-gray-600">Non hai un account? </span>
          <button
            onClick={() => router.push('/registration')}
            className="text-purple-500 hover:text-purple-600 font-medium"
          >
            Registrati
          </button>
        </div>
      </div>
    </div>
  )
}
