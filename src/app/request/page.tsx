// app/request/page.tsx - DESIGN ÉPURÉ REFAIT DE ZÉRO
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
  { id: 'campus', name: 'Campus PSG' },
  { id: 'domicile', name: 'Domicile Jordan' }
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
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
        
        {/* Header propre */}
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour</span>
          </Link>
          <h1 className="text-xl font-bold text-white">Nouvelle Course</h1>
          <div className="w-16"></div>
        </div>

        {/* Formulaire épuré */}
        <div className="px-4 max-w-sm mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Date */}
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Date *
              </label>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start bg-white border-gray-200 hover:bg-gray-50 h-12 rounded-xl text-gray-900",
                      !date && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Choisir une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white rounded-xl shadow-xl border-gray-200">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={fr}
                    defaultMonth={new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Heure */}
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Heure *
              </label>
              
              <Select value={formData.time} onValueChange={(value) => setFormData({...formData, time: value})}>
                <SelectTrigger className="w-full bg-white border-gray-200 hover:bg-gray-50 h-12 rounded-xl text-gray-900">
                  <SelectValue placeholder="Choisir l'heure" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-xl border-gray-200 max-h-60">
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time} className="hover:bg-gray-50 text-gray-900">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Départ */}
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-400" />
                Départ *
              </label>
              
              <Select value={formData.departure} onValueChange={(value) => setFormData({...formData, departure: value})}>
                <SelectTrigger className="w-full bg-white border-gray-200 hover:bg-gray-50 h-12 rounded-xl text-gray-900">
                  <SelectValue placeholder="Lieu de départ" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-xl border-gray-200">
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.name} className="hover:bg-gray-50 text-gray-900">
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400" />
                Destination *
              </label>
              
              <Select value={formData.destination} onValueChange={(value) => setFormData({...formData, destination: value})}>
                <SelectTrigger className="w-full bg-white border-gray-200 hover:bg-gray-50 h-12 rounded-xl text-gray-900">
                  <SelectValue placeholder="Lieu de destination" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-xl border-gray-200">
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.name} className="hover:bg-gray-50 text-gray-900">
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-400" />
                Notes (optionnel)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Notes rapides..."
                className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl p-3 h-20 resize-none transition-all text-gray-900 placeholder-gray-500"
                rows={3}
              />
            </div>

            {/* Bouton submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Envoyer</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
}