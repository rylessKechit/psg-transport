// app/request/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import { Calendar, Clock, MapPin, MessageSquare, Send, ArrowLeft, Loader2, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const locations = [
  { id: 'campus', name: 'Campus PSG', wazeLink: 'https://waze.com/ul/hu09qmbevr' },
  { id: 'domicile', name: 'Domicile Jordan', wazeLink: 'https://waze.com/ul/hu09tkg0mu' }
];

const timeSlots = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
];

export default function RequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState({
    time: '',
    departure: '',
    destination: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !formData.time || !formData.departure || !formData.destination) {
      alert('Merci de remplir tous les champs obligatoires !');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date.toISOString(),
          time: formData.time,
          departure: formData.departure,
          destination: formData.destination,
          notes: formData.notes
        })
      });

      if (response.ok) {
        alert('🎉 Course demandée avec succès !');
        router.push('/');
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      alert('❌ Erreur lors de l\'envoi. Essaie à nouveau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="h-full overflow-y-auto">

        {/* LOGO PSG EN ARRIÈRE-PLAN */}
        <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none psg-watermark">
          <div 
            className="w-96 h-96 bg-no-repeat bg-center bg-contain"
            style={{ backgroundImage: "url('/logo-psg-watermark.webp')" }}
          />
        </div>

        <div className="container-compact relative z-10 py-4">
          {/* Header COMPACT */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium font-playfair text-sm">Retour</span>
            </Link>
            <h1 className="font-playfair text-lg font-bold text-white">Nouvelle Course</h1>
            <div className="w-16"></div>
          </div>

          {/* Formulaire COMPACT pour mobile */}
          <form onSubmit={handleSubmit} className="space-compact">
            
            {/* Date */}
            <div className="card-compact p-4">
              <label className="label-compact font-playfair">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Date *</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="select-compact w-full font-playfair"
                    style={{ 
                      color: '#1f2937', 
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                      border: '2px solid #3b82f6',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '500',
                      padding: '12px 16px',
                      minHeight: '48px'
                    }}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                    <span style={{ color: '#1f2937' }}>
                      {date ? format(date, "dd/MM/yyyy", { locale: fr }) : "Choisir une date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    locale={fr}
                    className="rounded-xl border-0"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Heure */}
            <div className="card-compact p-4">
              <label className="label-compact font-playfair">
                <Clock className="h-4 w-4 text-purple-600" />
                <span>Heure *</span>
              </label>
              <Select value={formData.time} onValueChange={(value) => setFormData({...formData, time: value})}>
                <SelectTrigger className="select-compact w-full font-playfair">
                  <SelectValue 
                    placeholder="Choisir l'heure" 
                    style={{ color: '#1f2937', fontWeight: '500' }}
                  />
                </SelectTrigger>
                <SelectContent className="select-content">
                  {timeSlots.map(time => (
                    <SelectItem 
                      key={time} 
                      value={time} 
                      className="select-item font-playfair"
                      style={{ color: '#1f2937' }}
                    >
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Départ */}
            <div className="card-compact p-4">
              <label className="label-compact font-playfair">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Départ *</span>
              </label>
              <Select value={formData.departure} onValueChange={(value) => setFormData({...formData, departure: value})}>
                <SelectTrigger className="select-compact w-full font-playfair">
                  <SelectValue 
                    placeholder="D'où ?" 
                    style={{ color: '#1f2937', fontWeight: '500' }}
                  />
                </SelectTrigger>
                <SelectContent className="select-content">
                  {locations.map(location => (
                    <SelectItem 
                      key={location.id} 
                      value={location.name} 
                      className="select-item font-playfair"
                      style={{ color: '#1f2937' }}
                    >
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination */}
            <div className="card-compact p-4">
              <label className="label-compact font-playfair">
                <MapPin className="h-4 w-4 text-red-600" />
                <span>Destination *</span>
              </label>
              <Select value={formData.destination} onValueChange={(value) => setFormData({...formData, destination: value})}>
                <SelectTrigger className="select-compact w-full font-playfair">
                  <SelectValue 
                    placeholder="Vers où ?" 
                    style={{ color: '#1f2937', fontWeight: '500' }}
                  />
                </SelectTrigger>
                <SelectContent className="select-content">
                  {locations.map(location => (
                    <SelectItem 
                      key={location.id} 
                      value={location.name} 
                      className="select-item font-playfair"
                      style={{ color: '#1f2937' }}
                    >
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="card-compact p-4">
              <label className="label-compact font-playfair">
                <MessageSquare className="h-4 w-4 text-orange-600" />
                <span>Notes (optionnel)</span>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Notes rapides..."
                className="input-compact w-full resize-none h-20 font-playfair"
                style={{ 
                  color: '#1f2937', 
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  border: '2px solid #10b981',
                  borderRadius: '12px',
                  fontSize: '16px',
                  padding: '12px 16px'
                }}
                rows={3}
              />
            </div>

            {/* Bouton d'envoi COMPACT */}
            <button
              type="submit"
              disabled={loading}
              className="btn-psg font-playfair disabled:opacity-50 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <span className="text-white">Envoi...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 text-white" />
                  <span className="text-white">Envoyer</span>
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </Layout>
  );
}