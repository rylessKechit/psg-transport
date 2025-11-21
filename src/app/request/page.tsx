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

        <div className="container-compact relative z-10 py-6">
          {/* Header navigation - PLUS GRAND */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center space-x-2 text-white hover:text-yellow-300">
              <ArrowLeft className="h-6 w-6" />
              <span className="font-medium font-playfair text-white text-lg">Retour</span>
            </Link>
            <h1 className="font-playfair text-2xl font-bold text-white">Nouvelle Course</h1>
            <div className="w-20"></div>
          </div>

          {/* Formulaire avec PLUS GROS TEXTES */}
          <form onSubmit={handleSubmit} className="space-large">
            
            {/* Date */}
            <div className="card-simple p-5">
              <label className="flex items-center space-x-3 text-gray-900 font-semibold mb-4 font-playfair text-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="text-gray-900">Date *</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-14 justify-start text-left font-medium font-playfair text-gray-900 bg-white border-gray-300 text-lg",
                      !date && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-gray-700" />
                    <span className="text-gray-900">
                      {date ? format(date, "EEEE dd MMMM yyyy", { locale: fr }) : "Choisir une date"}
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
                    className="rounded-md border-0"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Heure */}
            <div className="card-simple p-5">
              <label className="flex items-center space-x-3 text-gray-900 font-semibold mb-4 font-playfair text-lg">
                <Clock className="h-6 w-6 text-green-600" />
                <span className="text-gray-900">Heure *</span>
              </label>
              <Select value={formData.time} onValueChange={(value) => setFormData({...formData, time: value})}>
                <SelectTrigger className="w-full h-14 font-playfair text-gray-900 bg-white border-gray-300 text-lg">
                  <SelectValue placeholder="Choisir l'heure" className="text-gray-900" />
                </SelectTrigger>
                <SelectContent className="max-h-40 bg-white">
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time} className="font-playfair text-gray-900 hover:bg-gray-100 text-lg">{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Départ */}
            <div className="card-simple p-5">
              <label className="flex items-center space-x-3 text-gray-900 font-semibold mb-4 font-playfair text-lg">
                <MapPin className="h-6 w-6 text-emerald-600" />
                <span className="text-gray-900">Départ *</span>
              </label>
              <Select value={formData.departure} onValueChange={(value) => setFormData({...formData, departure: value})}>
                <SelectTrigger className="w-full h-14 font-playfair text-gray-900 bg-white border-gray-300 text-lg">
                  <SelectValue placeholder="D'où ?" className="text-gray-900" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.name} className="font-playfair text-gray-900 hover:bg-gray-100 text-lg">{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination */}
            <div className="card-simple p-5">
              <label className="flex items-center space-x-3 text-gray-900 font-semibold mb-4 font-playfair text-lg">
                <MapPin className="h-6 w-6 text-red-600" />
                <span className="text-gray-900">Destination *</span>
              </label>
              <Select value={formData.destination} onValueChange={(value) => setFormData({...formData, destination: value})}>
                <SelectTrigger className="w-full h-14 font-playfair text-gray-900 bg-white border-gray-300 text-lg">
                  <SelectValue placeholder="Vers où ?" className="text-gray-900" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.name} className="font-playfair text-gray-900 hover:bg-gray-100 text-lg">{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="card-simple p-5">
              <label className="flex items-center space-x-3 text-gray-900 font-semibold mb-4 font-playfair text-lg">
                <MessageSquare className="h-6 w-6 text-amber-600" />
                <span className="text-gray-900">Notes (optionnel)</span>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Notes rapides..."
                className="w-full p-4 border border-gray-300 rounded-lg resize-none h-24 font-playfair text-gray-900 placeholder-gray-500 bg-white text-lg"
                rows={3}
              />
            </div>

            {/* Bouton d'envoi PLUS GROS */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-4 shadow-xl hover:shadow-2xl transform hover:scale-105 font-playfair disabled:opacity-50 text-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                  <span className="text-white">Envoi...</span>
                </>
              ) : (
                <>
                  <Send className="h-6 w-6 text-white" />
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