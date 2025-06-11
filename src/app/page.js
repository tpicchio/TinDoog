import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-white">
      <div className="flex flex-col rounded-lg justify-center items-center bg-[#AA54EA] h-9/10 w-1/3">
        <div className="flex justify-center items-center gap-4">
          <Image
          src="/tindoogIco.png"
          alt="Tindoog icon"
          width={100}
          height={100}
          />
          <h1 className="font-semibold text-5xl">TinDoog</h1>
        </div>

        <div className="text-center my-12">
          <p className="text-xl">Benvenuto in TinDoog</p>
          <p className="text-xl">accedi o registrati</p>
          <p className="text-xl">qui sotto.</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button className="border border-white rounded-full px-16 py-3 uppercase w-64">
            Accedi
          </button>
          <Link href="/registrazione">
            <button 
            type="button"
            className="border border-white rounded-full px-16 py-3 uppercase w-64 hover:bg-white">
              Registrati
            </button>
          </Link>
        </div>
      </div>
    </div>

  );
}
