// components/layout/Header.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-psg-blue-900 to-psg-blue-800 shadow-xl">
      <div className="container-psg">
        <div className="flex items-center justify-center py-4">
          {/* Logo PSG Transport */}
          <Link href="/" className="flex items-center space-x-4 group">
            {/* Logo Image */}
            <div className="relative w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 group-hover:bg-white/20 transition-all duration-300 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo-ysg.png" // Place ton logo dans public/logo-psg.png
                alt="PSG Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
              {/* Fallback si pas d'image */}
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                PSG
              </div>
            </div>
            
            {/* Texte */}
            <div>
              <h1 className="text-2xl font-bold text-white font-psg">
                PSG Transport
              </h1>
              <p className="text-psg-blue-200 text-sm font-medium">
                Jordan - Campus & Domicile
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}