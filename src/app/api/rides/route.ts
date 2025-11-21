// app/api/rides/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectToDatabase from '../../../lib/mongodb';
import mongoose from 'mongoose';

// Schéma Ride (inline pour simplifier)
const rideSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  notes: { type: String, default: '' },
  playerName: { type: String, default: 'Jordan' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notificationSent: { type: Boolean, default: false },
  reminder10hSent: { type: Boolean, default: false },
  reminder2hSent: { type: Boolean, default: false },
}, {
  timestamps: true
});

const Ride = mongoose.models.Ride || mongoose.model('Ride', rideSchema);

// Configuration email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

function generateEmailHTML(rideData: any) {
  const formattedDate = new Date(rideData.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Mapping des liens Waze
  const getWazeLink = (location: string) => {
    if (location === 'Campus PSG') return 'https://waze.com/ul/hu09qmbevr';
    if (location === 'Domicile') return 'https://waze.com/ul/hu09tkg0mu';
    return '#';
  };

  const departureWaze = getWazeLink(rideData.departure);
  const destinationWaze = getWazeLink(rideData.destination);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouvelle demande de course PSG</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #004170 0%, #556bff 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .ride-card { background: #f1f5f9; border-left: 4px solid #004170; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail { margin: 15px 0; }
        .location { display: flex; align-items: center; justify-content: space-between; margin: 10px 0; }
        .location-name { font-weight: bold; color: #004170; }
        .waze-btn { background: #00d4aa; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-flex; align-items: center; }
        .waze-btn:hover { background: #00b894; }
        .icon { width: 20px; margin-right: 12px; }
        .highlight { color: #004170; font-weight: bold; }
        .notes { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        .trajet { background: linear-gradient(90deg, #004170 0%, #E1000F 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚗 Nouvelle demande de course</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Jordan PSG Transport</p>
        </div>
        
        <div class="content">
          <h2 style="color: #004170; margin-bottom: 20px;">📋 Détails de la course</h2>
          
          <div class="ride-card">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <span class="icon">📅</span>
              <span><strong>Date:</strong> <span class="highlight">${formattedDate}</span></span>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <span class="icon">🕐</span>
              <span><strong>Heure:</strong> <span class="highlight">${rideData.time}</span></span>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <span class="icon">👤</span>
              <span><strong>Joueur:</strong> <span class="highlight">Jordan</span></span>
            </div>
          </div>

          <div class="trajet">
            <h3 style="margin: 0 0 15px 0;">🗺️ TRAJET</h3>
            <div style="font-size: 18px; font-weight: bold;">
              ${rideData.departure} → ${rideData.destination}
            </div>
          </div>
          
          <!-- DÉPART avec Waze -->
          <div style="background: #dcfce7; border: 2px solid #16a34a; padding: 20px; border-radius: 12px; margin: 15px 0;">
            <div class="location">
              <div>
                <div style="font-size: 16px; font-weight: bold; color: #16a34a; margin-bottom: 5px;">
                  📍 DÉPART
                </div>
                <div class="location-name" style="font-size: 18px; color: #16a34a;">
                  ${rideData.departure}
                </div>
              </div>
              <a href="${departureWaze}" class="waze-btn" target="_blank">
                🗺️ Waze
              </a>
            </div>
          </div>

          <!-- DESTINATION avec Waze -->
          <div style="background: #fef2f2; border: 2px solid #E1000F; padding: 20px; border-radius: 12px; margin: 15px 0;">
            <div class="location">
              <div>
                <div style="font-size: 16px; font-weight: bold; color: #E1000F; margin-bottom: 5px;">
                  🎯 DESTINATION
                </div>
                <div class="location-name" style="font-size: 18px; color: #E1000F;">
                  ${rideData.destination}
                </div>
              </div>
              <a href="${destinationWaze}" class="waze-btn" target="_blank">
                🗺️ Waze
              </a>
            </div>
          </div>
          
          ${rideData.notes ? `
            <div class="notes">
              <strong>📝 Notes de Jordan:</strong><br>
              ${rideData.notes}
            </div>
          ` : ''}
          
          <div style="background: #e0e7ff; border: 2px solid #6366f1; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
            <h3 style="color: #6366f1; margin: 0 0 10px 0;">✅ Actions rapides</h3>
            <div style="color: #6366f1;">
              <p style="margin: 5px 0;">• Clique sur les boutons Waze ci-dessus</p>
              <p style="margin: 5px 0;">• Confirme à Jordan par SMS/WhatsApp</p>
              <p style="margin: 5px 0;">• Note l'heure dans ton agenda</p>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Email automatique envoyé depuis PSG Transport Platform</p>
          <p>Demande reçue le ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, departure, destination, notes } = body;

    // Validation
    if (!date || !time || !departure || !destination) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Connexion à la base de données
    await connectToDatabase();

    // Créer la course
    const ride = new Ride({
      date: new Date(date),
      time,
      departure,
      destination,
      notes: notes || '',
      playerName: 'Jordan'
    });

    await ride.save();

    // Envoyer l'email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.DRIVER_EMAIL,
      subject: `🚗 Nouvelle course PSG - Jordan (${date} à ${time})`,
      html: generateEmailHTML({ date, time, departure, destination, notes })
    };

    await transporter.sendMail(mailOptions);

    // Marquer la notification comme envoyée
    ride.notificationSent = true;
    await ride.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Course créée et email envoyé',
      rideId: ride._id 
    });

  } catch (error) {
    console.error('Erreur API rides:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Récupérer les courses futures
    const rides = await Ride.find({
      date: { $gte: new Date() }
    }).sort({ date: 1, time: 1 });

    return NextResponse.json({ rides });
  } catch (error) {
    console.error('Erreur GET rides:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}