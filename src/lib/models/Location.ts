// lib/models/Location.ts
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['campus', 'home', 'training', 'stadium', 'other'],
    required: true
  },
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  isActive: { type: Boolean, default: true },
  frequency: { type: Number, default: 0 } // Compteur d'utilisation
});