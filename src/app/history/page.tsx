// app/history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { Calendar, Clock, MapPin, ArrowLeft, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Ride {
  _id: string;
  date: string;
  time: string;
  departure: string;
  destination: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function HistoryPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await fetch('/api/rides');
      if (response.ok) {
        const data = await response.json();
        setRides(data.rides || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'En attente';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isUpcoming = (dateString: string, time: string) => {
    const rideDate = new Date(dateString);
    const [hours, minutes] = time.split(':');
    rideDate.setHours(parseInt(hours), parseInt(minutes));
    return rideDate > new Date();
  };

  const filteredRides = rides.filter(ride => {
    if (filter === 'upcoming') return isUpcoming(ride.date, ride.time);
    if (filter === 'past') return !isUpcoming(ride.date, ride.time);
    return true;
  });

  const upcomingCount = rides.filter(ride => isUpcoming(ride.date, ride.time)).length;
  const pastCount = rides.filter(ride => !isUpcoming(ride.date, ride.time)).length;

  if (loading) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <div className="text-white text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="font-playfair text-xl">Chargement des courses...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-full overflow-y-auto">
        <div className="container-compact relative z-10 py-6">
          {/* Header PLUS GRAND */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center space-x-2 text-white hover:text-yellow-300">
              <ArrowLeft className="h-6 w-6" />
              <span className="font-medium font-playfair text-lg">Retour</span>
            </Link>
            <h1 className="font-playfair text-2xl font-bold text-white">Historique</h1>
            <div className="w-20"></div>
          </div>

          {/* Stats PLUS GRANDES */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card-simple p-5 text-center">
              <div className="text-3xl font-bold text-gray-900 font-playfair">{upcomingCount}</div>
              <div className="text-lg text-gray-600 font-playfair">À venir</div>
            </div>
            <div className="card-simple p-5 text-center">
              <div className="text-3xl font-bold text-gray-900 font-playfair">{pastCount}</div>
              <div className="text-lg text-gray-600 font-playfair">Passées</div>
            </div>
          </div>

          {/* Filtres AMÉLIORÉS avec MEILLEURS contrastes */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Toutes' },
                { key: 'upcoming', label: 'À venir' },
                { key: 'past', label: 'Passées' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 font-playfair text-lg border-2 ${
                    filter === key 
                      ? 'btn-history-active' 
                      : 'btn-history-inactive'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Liste des courses PLUS GRANDE */}
          <div className="space-large">
            {filteredRides.length === 0 ? (
              <div className="card-simple p-8 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="font-playfair font-bold text-gray-700 mb-4 text-2xl">
                  {filter === 'upcoming' ? 'Aucune course à venir' : 
                   filter === 'past' ? 'Aucune course passée' : 'Aucune course'}
                </h3>
                <p className="text-gray-500 mb-6 font-playfair text-lg">
                  {filter === 'all' ? 'Jordan n\'a pas encore programmé de course.' : ''}
                </p>
                <Link href="/request">
                  <button className="bg-psg-red text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-600 transition-colors font-playfair text-lg">
                    Programmer une course
                  </button>
                </Link>
              </div>
            ) : (
              filteredRides.map((ride) => (
                <div key={ride._id} className="card-simple p-6 shadow-lg">
                  {/* En-tête PLUS GROS */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-6 w-6 text-psg-blue" />
                      <span className="text-lg font-medium text-gray-700 font-playfair">
                        {formatDate(ride.date)}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full border font-semibold ${getStatusBg(ride.status)}`}>
                      {getStatusIcon(ride.status)}
                      <span className="font-playfair text-sm">
                        {getStatusText(ride.status)}
                      </span>
                    </div>
                  </div>

                  {/* Heure PLUS GRANDE */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="h-6 w-6 text-psg-blue" />
                    <span className="text-2xl font-bold text-gray-900 font-playfair">
                      {ride.time}
                    </span>
                    {isUpcoming(ride.date, ride.time) && (
                      <span className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium font-playfair">
                        À venir
                      </span>
                    )}
                  </div>

                  {/* Trajet PLUS GROS */}
                  <div className="bg-gradient-to-r from-green-50 to-red-50 p-5 rounded-xl mb-4">
                    <div className="flex items-center justify-between text-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                        <span className="font-medium text-gray-900 font-playfair">{ride.departure}</span>
                      </div>
                      <div className="flex-1 border-t-2 border-dashed border-gray-400 mx-4"></div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-red-600 font-playfair">{ride.destination}</span>
                        <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Notes PLUS GRANDES */}
                  {ride.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-yellow-600 mt-1" />
                        <div>
                          <div className="text-sm font-medium text-yellow-800 mb-2 font-playfair">Notes :</div>
                          <div className="text-lg text-yellow-700 font-playfair">{ride.notes}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date de création PLUS GRANDE */}
                  <div className="text-sm text-gray-500 text-center font-playfair">
                    Demandée le {new Date(ride.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bouton flottant PLUS GROS */}
          {filteredRides.length > 0 && (
            <div className="fixed bottom-8 right-6 z-50">
              <Link href="/request">
                <button className="bg-gradient-to-r from-psg-red to-red-600 text-white p-5 rounded-full shadow-2xl hover:shadow-red-500/25 transform hover:scale-110 transition-all duration-300">
                  <Calendar className="h-8 w-8" />
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}