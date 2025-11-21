// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Plus, Phone, History, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      <div className="h-full flex flex-col justify-between">

        {/* Contenu principal - spacing PLUS GRAND */}
        <div className="container-compact relative z-10 flex flex-col justify-between h-full py-8">
          
          {/* SECTION 1: Salutation PLUS GRANDE */}
          <div className="text-center text-white-forced">
            <h1 className="font-playfair text-4xl font-bold text-white mb-4">
              Salut Jordan ! 👋
            </h1>
            <div className="text-white">
              <div className="text-xl font-medium text-white font-playfair mb-2">
                {currentTime.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </div>
              <div className="text-2xl font-bold flex items-center justify-center space-x-3 text-white">
                <Clock className="h-6 w-6 text-yellow-300" />
                <span className="font-playfair text-white">
                  {currentTime.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Action principale PLUS GRANDE */}
          <div className="text-center space-large">
            <p className="text-white text-2xl font-medium font-playfair mb-6">
              Besoin d'un transport pour le PSG ?
            </p>
            
            <Link href="/request">
              <button className="btn-psg text-xl font-playfair py-6">
                <Plus className="h-7 w-7" />
                <span>Demander une course</span>
              </button>
            </Link>

            {/* Info PLUS GRANDE */}
            <div className="card-simple p-6">
              <h3 className="font-playfair font-bold text-gray-900 mb-4 text-xl">
                Comment ça marche ?
              </h3>
              <div className="text-gray-700 text-lg space-y-3 font-playfair">
                <p className="text-gray-700">• Formulaire simple</p>
                <p className="text-gray-700">• Email instantané</p>
                <p className="text-gray-700">• Confirmation rapide ✅</p>
              </div>
            </div>
          </div>

          {/* SECTION 3: Actions secondaires PLUS GRANDES */}
          <div className="flex justify-center space-x-4">
            <a 
              href="tel:+33123456789" 
              className="flex items-center space-x-3 bg-white/95 backdrop-blur-sm text-gray-900 font-semibold px-6 py-4 rounded-xl border border-white/80 hover:bg-white transition-all duration-200 shadow-lg font-playfair text-lg"
            >
              <Phone className="h-5 w-5 text-blue-600" />
              <span className="text-gray-900">Appeler</span>
            </a>

            <Link href="/history">
              <button className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-4 rounded-xl border border-white/40 hover:bg-white/30 transition-all duration-200 shadow-lg font-playfair text-lg">
                <History className="h-5 w-5 text-yellow-300" />
                <span className="text-white">Historique</span>
              </button>
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}