// lib/models/Ride.ts
import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  // Info de base
  date: { type: Date, required: true },
  time: { type: String, required: true }, // "18:00"
  
  // Localisation
  departure: {
    name: { type: String, required: true }, // "Campus PSG"
    address: { type: String },
    coordinates: { lat: Number, lng: Number }
  },
  destination: {
    name: { type: String, required: true }, // "Domicile"
    address: { type: String },
    coordinates: { lat: Number, lng: Number }
  },
  
  // Détails
  notes: { type: String, default: '' },
  playerName: { type: String, default: 'Jordan' },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Notifications
  notificationSent: { type: Boolean, default: false },
  reminder10hSent: { type: Boolean, default: false },
  reminder2hSent: { type: Boolean, default: false },
  
}, {
  timestamps: true // createdAt, updatedAt auto
});