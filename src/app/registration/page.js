"use client";

import React from 'react';
import { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";

// Importa i componenti necessari per la registrazione
import { DogName } from '@/components/registration/dog-name';
import { BreedSelection } from '@/components/registration/breed-selection';
import { RegisterEmail } from '@/components/registration/register-email';
import { VerifyEmail } from '@/components/registration/verify-email';
import { CreatePassword } from '@/components/registration/create-password';



export default function RegistrationController() {
	// This component will handle the registration flow
	// and render the appropriate components based on the current step.
	const [step, setStep] = useState(0);

	let content;
	switch (step) {
		case 0:
			content = <DogName onNext={() => setStep(step + 1)} />;
			break;
		case 1:
			content = <BreedSelection onNext={() => setStep(step + 1)} />;
			break;
		case 2:
			content = <RegisterEmail onNext={() => setStep(step + 1)} />;
			break;
		case 3:
			content = <VerifyEmail onNext={() => setStep(step + 1)} />;
			break;
		case 4:
			content = <CreatePassword onNext={() => setStep(step + 1)} />;
			break;
		default:
			content = null;
	}
	return (
		<div className="flex justify-center items-center h-screen w-screen bg-[#AA54EA]">
			<div className="flex flex-col h-9/10 w-1/3 rounded-lg bg-white p-6 font-sans">
				{/* Icona di chiusura in alto a sinistra */}
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