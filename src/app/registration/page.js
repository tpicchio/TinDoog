"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Components
import { DogName } from '@/components/registration/dog-name';
import { BreedSelection } from '@/components/registration/breed-selection';
import { RegisterEmail } from '@/components/registration/register-email';
import { VerifyEmail } from '@/components/registration/verify-email';
import { CreatePassword } from '@/components/registration/create-password';
import { LoadingScreen } from '@/components/utils/loading-screen';



export default function RegistrationController() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [step, setStep] = useState(0);
	const [formData, setFormData] = useState({
		dogName: '',
		breed: '',
		email: '',
		password: ''
	});

	// Reindirizza se l'utente è già loggato
	useEffect(() => {
		if (status === 'authenticated') {
			router.push('/dashboard');
		}
	}, [status, router]);

	// Mostra loading durante la verifica della sessione
	if (status === 'loading') {
		return <LoadingScreen />;
	}

	// Non mostrare nulla se l'utente è autenticato (verrà reindirizzato)
	if (status === 'authenticated') {
		return null;
	}

	const updateFormData = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleRegistration = async () => {
		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				// Redirect to login or automatically sign in
				window.location.href = '/login';
			} else {
				const error = await response.json();
				alert('Errore durante la registrazione: ' + error.message);
			}
		} catch (error) {
			alert('Errore durante la registrazione: ' + error.message);
		}
	};

	let content;
	switch (step) {
		case 0:
			content = <RegisterEmail 
				value={formData.email}
				onNext={(email) => {
					updateFormData('email', email);
					setStep(step + 1);
				}} 
			/>;
			break;
		case 1:
			content = <VerifyEmail onNext={() => setStep(step + 1)} />;
			break;
		case 2:
			content = <DogName 
			value={formData.dogName}
			onNext={(name) => {
				updateFormData('dogName', name);
				setStep(step + 1);
			}} 
			/>;
			break;
		case 3:
			content = <BreedSelection 
			value={formData.breed}
			onNext={(breed) => {
				updateFormData('breed', breed);
				setStep(step + 1);
			}} 
			/>;
			break;
		case 4:
			content = <CreatePassword 
				onNext={(password) => {
					updateFormData('password', password);
					handleRegistration();
				}} 
			/>;
			break;
		
		default:
			content = null;
	}
	return (
		<div className="flex justify-center items-center h-screen w-screen bg-[#AA54EA]">
			<div className="flex flex-col h-9/10 w-1/3 rounded-lg bg-white p-6 font-sans">
				<div className="self-start">
					<button
						aria-label="Back"
						className="text-4xl text-gray-400 hover:text-gray-600"
						onClick={() => {
							if (step === 0) {
								window.location.href = '/';
							} else {
								setStep(step - 1);
							}
						}}
					>
						<IoIosArrowBack />
					</button>
				</div>

				{/* Contenitore per il contenuto principale con margine superiore */}
				<div className="mt-20">
					{content}
				</div>
			</div>
		</div>
	);
}
