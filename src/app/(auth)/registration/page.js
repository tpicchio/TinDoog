"use client";

import React from 'react';
import { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";

// Components
import { DogName } from '@/components/registration/dog-name';
import { BreedSelection } from '@/components/registration/breed-selection';
import { RegisterEmail } from '@/components/registration/register-email';
import { VerifyEmail } from '@/components/registration/verify-email';
import { CreatePassword } from '@/components/registration/create-password';
import { LoadingScreen } from '@/components/utils/loading-screen';
import { LocationPermission } from '@/components/registration/location-permission';
import { Age } from '@/components/registration/age';
import { ImageSelectionRegistration } from '@/components/registration/image-selection';

export default function RegistrationController() {
	// I controlli di autenticazione sono gestiti dal layout (auth)
	const [step, setStep] = useState(0);
	const [isRegistering, setIsRegistering] = useState(false);
	const [formData, setFormData] = useState({
		location: null,
		email: '',
		dogName: '',
		breed: '',
		gender: '',
		age: -1,
		password: '',
		images: []
	});

	// Mostra loading durante la registrazione
	if (isRegistering) {
		return <LoadingScreen message="Registrazione completata, reindirizzamento al login..." />;
	}

	const updateFormData = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleRegistration = async (finalPassword) => {
		// Avvia il loading
		setIsRegistering(true);

		// Crea i dati completi includendo la password finale
		const completeData = {
			...formData,
			password: finalPassword
		};

		console.log('Dati inviati alla registrazione:', completeData); // Debug

		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(completeData),
			});

			if (response.ok) {
				// Redirect to login or automatically sign in
				window.location.href = '/login';
			} else {
				const error = await response.json();
				setIsRegistering(false); // Ferma il loading in caso di errore
				alert('Errore durante la registrazione: ' + error.message);
			}
		} catch (error) {
			setIsRegistering(false); // Ferma il loading in caso di errore
			alert('Errore durante la registrazione: ' + error.message);
		}
	};

	const handleLocationDenied = () => {
		alert('La geolocalizzazione è necessaria per utilizzare TinDoog. Verrai reindirizzato alla home.');
		router.push('/');
	};

	let content;
	switch (step) {
		case 0:
			content = <LocationPermission 
				onNext={(locationData) => {
				updateFormData('location', locationData);
				setStep(step + 1);
				}}
				onCancel={handleLocationDenied}
			/>;
			break;
		case 1:
			content = <RegisterEmail 
				value={formData.email}
				onNext={(email) => {
					updateFormData('email', email);
					setStep(step + 1);
				}} 
			/>;
			break;
		case 2:
			content = <VerifyEmail 
				email={formData.email}
				onNext={() => setStep(step + 1)} 
			/>;
			break;
		case 3:
			content = <DogName 
			value={formData.dogName}
			onNext={(name) => {
				updateFormData('dogName', name);
				setStep(step + 1);
			}} 
			/>;
			break;
		case 4:
			content = <BreedSelection 
			value={{ breed: formData.breed, gender: formData.gender }}
			onNext={(data) => {
				updateFormData('breed', data.breed);
				updateFormData('gender', data.gender);
				setStep(step + 1);
			}} 
			/>;
			break;
		case 5:
			content = <Age 
			value={formData.age}
			onNext={(age) => {
				updateFormData('age', age);
				console.log('Age: ', age);
				setStep(step + 1);
			}}/>
			break;
		case 6:
			content = <ImageSelectionRegistration
				onNext={(images) => {
					updateFormData('images', images);
					setStep(step + 1);
				}}
			/>
			break;
		case 7:
			content = <CreatePassword 
				onNext={(password) => {
					updateFormData('password', password);
					handleRegistration(password); // Passa la password direttamente
				}} 
			/>;
			break;
		
		default:
			content = null;
	}
	return (
		<div className="flex justify-center items-center h-screen w-screen bg-purple-500">
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
