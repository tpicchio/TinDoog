"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Components
import {LoadingScreen} from '@/components/utils/loading-screen';

export default function Home() {
	const { status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === 'authenticated') {
			router.push('/dashboard');
		}
	}, [status, router]);

	if (status === 'loading'){
		return <LoadingScreen message="Caricamento..." />;
	}

	if (status === 'authenticated') {
		return null;
	}

	return (
		<div className="flex justify-center items-center h-screen w-screen bg-white">
			<div className="flex flex-col rounded-lg justify-center items-center bg-purple-500 h-9/10 w-1/3">
			<div className="flex justify-center items-center gap-4">
				<Image
					src="/tindoogIco.png"
					alt="Tindoog icon"
					width={100}
					height={100}
					style={{ height: "auto", width: "auto" }}
				/>
				<h1 className="font-semibold text-5xl">TinDoog</h1>
			</div>

			<div className="text-center my-12">
				<p className="text-xl">Benvenuto in TinDoog</p>
				<p className="text-xl">accedi o registrati</p>
				<p className="text-xl">qui sotto.</p>
			</div>

			<div className="flex flex-col items-center gap-4">
				<Link href="/login">
				<button className="border border-white text-white rounded-full px-16 py-3 uppercase w-64 hover:bg-white hover:text-purple-600 transition-colors">
					Accedi
				</button>
				</Link>
				<Link href="/registration">
				<button 
				type="button"
				className="border border-white text-white rounded-full px-16 py-3 uppercase w-64 hover:bg-white hover:text-purple-600 transition-colors">
					Registrati
				</button>
				</Link>
			</div>
			</div>
		</div>
	);
}
