// components/layout/Header.tsx
import Link from 'next/link';
import { Car } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-psg-blue-900 to-psg-blue-800 shadow-xl">
      <div className="container-psg">
        <div className="flex items-center justify-center py-4">
          {/* Logo PSG Transport */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl border border-white/30 group-hover:bg-white/30 transition-all duration-300">
              <Car className="h-7 w-7 text-white" />
            </div>
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