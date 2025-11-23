// app/page.tsx - DESIGN MODERNE REFAIT DE ZÉRO
'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Plus, Phone, History, Clock, MapPin } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
        
        {/* Header moderne */}
        <div className="pt-8 pb-6 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white">
              Salut Jordan ! 👋
            </h1>
            
            {/* Date et heure élégantes */}
            <div className="mx-auto max-w-xs bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="text-white/90 text-sm mb-1">
                {currentTime.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </div>
              <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                {currentTime.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="px-4 max-w-sm mx-auto space-y-6">
          
          {/* Question principale */}
          <div className="text-center">
            <p className="text-lg text-white/90 font-medium">
              Besoin d'un transport pour le PSG ?
            </p>
          </div>

          {/* Bouton principal moderne */}
          <Link href="/request">
            <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-lg">Demander une course</span>
            </button>
          </Link>

          {/* Info steps minimaliste */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded"></div>
              Comment ça marche ?
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <div className="text-white text-sm font-medium">Formulaire simple</div>
                  <div className="text-white/70 text-xs">Quelques clics</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <div className="text-white text-sm font-medium">Email instantané</div>
                  <div className="text-white/70 text-xs">Notification immédiate</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <div className="text-white text-sm font-medium">Confirmation rapide ✅</div>
                  <div className="text-white/70 text-xs">Réponse en minutes</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Boutons d'action en bas */}
        <div className="fixed bottom-6 left-4 right-4">
          <div className="max-w-sm mx-auto flex gap-3">
            <a 
              href="tel:+33123456789" 
              className="flex-1 bg-white/90 hover:bg-white text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Appeler</span>
            </a>

            <Link href="/history" className="flex-1">
              <button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-white/20">
                <History className="w-4 h-4" />
                <span className="text-sm">Historique</span>
              </button>
            </Link>
          </div>
        </div>

      </div>
    </Layout>
  );
}