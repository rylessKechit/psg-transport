// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Plus, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Horloge temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-psg-blue-900 via-psg-blue-800 to-psg-blue-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"></div>
        
        <div className="relative z-10 px-4 pt-8 pb-8">
          {/* Header avec salutation */}
          <div className="text-center space-y-4 mb-12">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-white font-psg mb-2">
                Salut Jordan ! 👋
              </h1>
              <div className="text-psg-blue-100">
                <div className="text-lg font-medium">
                  {currentTime.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </div>
                <div className="text-2xl font-mono font-bold text-white mt-1 flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>
                    {currentTime.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action principale */}
          <div className="text-center mb-8">
            <p className="text-psg-blue-100 text-lg mb-6 font-medium">
              Besoin d'un transport ?
            </p>
            <Link href="/request">
              <button className="w-full max-w-sm mx-auto bg-gradient-to-r from-psg-red to-red-600 hover:from-red-600 hover:to-psg-red text-white font-bold text-xl py-6 px-8 rounded-2xl shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 border-2 border-red-400">
                <Plus className="h-8 w-8" />
                <span>Demander une course</span>
              </button>
            </Link>
          </div>

          {/* Message d'information */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 mx-auto max-w-sm shadow-2xl border border-white/20 mb-8">
            <div className="text-center">
              <div className="bg-psg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-psg-blue-600" />
              </div>
              <h3 className="font-bold text-psg-blue-900 mb-3 text-lg">
                Comment ça marche ?
              </h3>
              <div className="text-psg-blue-800 text-sm leading-relaxed space-y-2">
                <p>• Tu remplis le formulaire simple</p>
                <p>• Je reçois ta demande par email</p>
                <p>• Confirmation très rapide ! ✅</p>
              </div>
            </div>
          </div>

          {/* Contact rapide */}
          <div className="text-center space-y-4">
            <p className="text-psg-blue-200 text-sm mb-4 font-medium">
              Urgence ou question ?
            </p>
            <a 
              href="tel:+33680807979" 
              className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-4 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 mb-4"
            >
              <Phone className="h-5 w-5" />
              <span>Appeler Curtis</span>
            </a>

            {/* Lien vers l'historique */}
            <div>
              <Link href="/history">
                <button className="inline-flex items-center space-x-3 bg-psg-blue-600/50 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-xl border border-psg-blue-400/50 hover:bg-psg-blue-600/70 transition-all duration-300 transform hover:scale-105">
                  <Clock className="h-5 w-5" />
                  <span>Voir mes courses</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}