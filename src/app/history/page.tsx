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
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
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
        <div className="min-h-screen bg-gradient-to-br from-psg-blue-900 via-psg-blue-800 to-psg-blue-900 flex items-center justify-center">
          <div className="text-white text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Chargement des courses...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-psg-blue-900 via-psg-blue-800 to-psg-blue-900 relative">
        <div className="relative z-10 px-4 pt-6 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Retour</span>
            </Link>
            <h1 className="text-xl font-bold text-white font-psg">Historique</h1>
            <div className="w-16"></div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-psg-blue-900">{upcomingCount}</div>
              <div className="text-sm text-psg-blue-600">À venir</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-psg-blue-900">{pastCount}</div>
              <div className="text-sm text-psg-blue-600">Passées</div>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 flex space-x-2">
              {[
                { key: 'all', label: 'Toutes' },
                { key: 'upcoming', label: 'À venir' },
                { key: 'past', label: 'Passées' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === key 
                      ? 'bg-psg-blue-600 text-white shadow-md' 
                      : 'text-psg-blue-600 hover:bg-psg-blue-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Liste des courses */}
          <div className="max-w-md mx-auto space-y-4">
            {filteredRides.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {filter === 'upcoming' ? 'Aucune course à venir' : 
                   filter === 'past' ? 'Aucune course passée' : 'Aucune course'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {filter === 'all' ? 'Jordan n\'a pas encore programmé de course.' : ''}
                </p>
                <Link href="/request">
                  <button className="bg-psg-red text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
                    Programmer une course
                  </button>
                </Link>
              </div>
            ) : (
              filteredRides.map((ride) => (
                <div key={ride._id} className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  {/* En-tête de la course */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-psg-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {formatDate(ride.date)}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusBg(ride.status)}`}>
                      {getStatusIcon(ride.status)}
                      <span className="text-xs font-semibold">
                        {getStatusText(ride.status)}
                      </span>
                    </div>
                  </div>

                  {/* Heure */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="h-5 w-5 text-psg-blue-600" />
                    <span className="text-lg font-bold text-psg-blue-900">
                      {ride.time}
                    </span>
                    {isUpcoming(ride.date, ride.time) && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        À venir
                      </span>
                    )}
                  </div>

                  {/* Trajet */}
                  <div className="bg-gradient-to-r from-psg-blue-50 to-red-50 p-4 rounded-xl mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-psg-blue-600 rounded-full"></div>
                        <span className="font-medium text-psg-blue-900">{ride.departure}</span>
                      </div>
                      <div className="flex-1 border-t border-dashed border-gray-400 mx-4"></div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-psg-red">{ride.destination}</span>
                        <div className="w-3 h-3 bg-psg-red rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {ride.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-yellow-800 mb-1">Notes :</div>
                          <div className="text-sm text-yellow-700">{ride.notes}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date de création */}
                  <div className="text-xs text-gray-500 text-center">
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

          {/* Bouton flottant pour nouvelle course */}
          {filteredRides.length > 0 && (
            <div className="fixed bottom-8 right-4 z-50">
              <Link href="/request">
                <button className="bg-gradient-to-r from-psg-red to-red-600 text-white p-4 rounded-full shadow-2xl hover:shadow-red-500/25 transform hover:scale-110 transition-all duration-300">
                  <Calendar className="h-6 w-6" />
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}