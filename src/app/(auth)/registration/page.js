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

/**
 * Multi-step registration wizard for TinDoog
 * Flow: Location → Email → Verification → Dog Info → Images → Password → Submit
 */
export default function RegistrationController() {
	const [step, setStep] = useState(0);
	// Prevents double-submission during final API call
	const [isRegistering, setIsRegistering] = useState(false);
	
	// Accumulated user data across all registration steps
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

	// Show loading screen during final submission to prevent multiple clicks
	if (isRegistering) {
		return <LoadingScreen message="Registrazione completata, reindirizzamento al login..." />;
	}

	// Helper to update specific field in accumulated form data
	const updateFormData = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	// Final step: Submit all collected data to registration API
	const handleRegistration = async (finalPassword) => {
		setIsRegistering(true);

		const completeData = {
			...formData,
			password: finalPassword
		};

		console.log('Dati inviati alla registrazione:', completeData);

		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(completeData),
			});

			if (response.ok) {
				window.location.href = '/login';
			} else {
				const error = await response.json();
				setIsRegistering(false);
				alert('Errore durante la registrazione: ' + error.message);
			}
		} catch (error) {
			setIsRegistering(false);
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
					handleRegistration(password);
				}} 
			/>;
			break;
		
		default:
			content = null;
	}
	
	return (
		<div className="flex justify-center items-center h-screen w-screen bg-purple-500">
			<div className="flex flex-col h-9/10 w-1/3 rounded-lg bg-white p-6 font-sans">
				{/* Back button - goes to previous step or home */}
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
				
				<div className="mt-20">
					{content}
				</div>
			</div>
		</div>
	);
}
