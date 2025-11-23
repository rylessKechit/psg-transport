// app/history/page.tsx - VERSION FINALE MODERNE
'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { Calendar, Clock, MapPin, ArrowLeft, Loader2, CheckCircle, XCircle, AlertCircle, Plus, MessageSquare } from 'lucide-react';
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
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
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
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-container">
            <Loader2 className="h-8 w-8 animate-spin text-white mb-4" />
            <p className="text-white text-xl font-playfair">Chargement des courses...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen overflow-y-auto">

        {/* LOGO PSG EN ARRIÈRE-PLAN */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
          <div 
            className="w-96 h-96 bg-no-repeat bg-center bg-contain"
            style={{ backgroundImage: "url('/logo-psg-watermark.webp')" }}
          />
        </div>

        <div className="container-modern relative z-10 py-6">
          
          {/* Header moderne */}
          <div className="page-header">
            <Link href="/" className="back-button">
              <ArrowLeft className="h-5 w-5" />
              <span>Retour</span>
            </Link>
            <h1 className="page-title">Historique</h1>
            <div className="w-20"></div>
          </div>

          {/* Stats modernes */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{upcomingCount}</div>
              <div className="stat-label">À venir</div>
              <div className="stat-accent bg-green-500"></div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{pastCount}</div>
              <div className="stat-label">Passées</div>
              <div className="stat-accent bg-blue-500"></div>
            </div>
          </div>

          {/* Filtres modernes */}
          <div className="filter-container">
            <div className="filter-buttons">
              {[
                { key: 'all', label: 'Toutes' },
                { key: 'upcoming', label: 'À venir' },
                { key: 'past', label: 'Passées' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`filter-btn ${filter === key ? 'filter-btn-active' : 'filter-btn-inactive'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Liste des courses */}
          <div className="rides-list">
            {filteredRides.length === 0 ? (
              <div className="empty-state">
                <Calendar className="h-16 w-16 text-white/50 mx-auto mb-4" />
                <h3 className="empty-title">
                  {filter === 'upcoming' ? 'Aucune course à venir' : 
                   filter === 'past' ? 'Aucune course passée' : 'Aucune course'}
                </h3>
                <p className="empty-description">
                  {filter === 'all' ? 'Jordan n\'a pas encore programmé de course.' : ''}
                </p>
                <Link href="/request">
                  <button className="empty-action-btn">
                    <Plus className="h-5 w-5" />
                    Programmer une course
                  </button>
                </Link>
              </div>
            ) : (
              filteredRides.map((ride) => (
                <div key={ride._id} className="ride-card group">
                  
                  {/* Header de la card */}
                  <div className="ride-header">
                    <div className="ride-date">
                      <Calendar className="h-5 w-5 text-white/80" />
                      <span>{formatDate(ride.date)}</span>
                    </div>
                    <div className={`ride-status ${getStatusBg(ride.status)}`}>
                      {getStatusIcon(ride.status)}
                      <span>{getStatusText(ride.status)}</span>
                    </div>
                  </div>

                  {/* Heure avec badge à venir */}
                  <div className="ride-time-section">
                    <div className="ride-time">
                      <Clock className="h-5 w-5 text-white/80" />
                      <span className="time-text">{ride.time}</span>
                    </div>
                    {isUpcoming(ride.date, ride.time) && (
                      <div className="upcoming-badge">
                        À venir
                      </div>
                    )}
                  </div>

                  {/* Trajet moderne */}
                  <div className="ride-route">
                    <div className="route-point route-start">
                      <div className="route-dot bg-green-500"></div>
                      <span>{ride.departure}</span>
                    </div>
                    <div className="route-line"></div>
                    <div className="route-point route-end">
                      <span>{ride.destination}</span>
                      <div className="route-dot bg-red-500"></div>
                    </div>
                  </div>

                  {/* Notes si présentes */}
                  {ride.notes && (
                    <div className="ride-notes">
                      <div className="notes-header">
                        <MessageSquare className="h-4 w-4 text-orange-400" />
                        <span>Notes :</span>
                      </div>
                      <div className="notes-content">{ride.notes}</div>
                    </div>
                  )}

                  {/* Footer avec date de création */}
                  <div className="ride-footer">
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
            <Link href="/request">
              <button className="floating-action-btn">
                <Plus className="h-6 w-6" />
              </button>
            </Link>
          )}

        </div>
      </div>
    </Layout>
  );
}