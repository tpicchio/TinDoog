import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center h-screen w-screen bg-white">
      <div className="flex flex-col justify-center items-center bg-[#AA54EA] h-screen w-1/3">
        <div className="flex justify-center items-center gap-4 sm:gap-4">
          <Image
          src="/tindoogIco.png"
          alt="Tindoog icon"
          width={100}
          height={100}
          />
          <h1 className="font-semibold text-5xl">Tindoog</h1>
        </div>
        <button className="border">Accedi</button>
        <button>Registrati</button>
      </div>
    </div>

  );
}
