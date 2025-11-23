// components/layout/Header.tsx - CORRIGÉ POUR ÊTRE VISIBLE
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="header-ysg">
      <div className="container-compact py-3">
        <Link href="/" className="flex items-center justify-center space-x-3">
          <Image
              src="/logo-ysg.png"
              alt="YSG Logo"
              width={45}
              height={45}
              className="object-contain"
              priority
            />
          <div className="text-center">
            <h1 className="font-playfair text-xl font-bold text-white header-title">
              YSG Transport
            </h1>
            <p className="text-white text-sm -mt-1 font-playfair header-subtitle">Jordan • PSG</p>
          </div>
        </Link>
      </div>
    </header>
  );
}