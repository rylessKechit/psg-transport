// lib/reminders.ts
import nodemailer from 'nodemailer';
import connectToDatabase from './mongodb';
import mongoose from 'mongoose';

// Configuration email (même que dans l'API)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Schéma Ride (doit être cohérent avec l'API)
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

function generateReminderHTML(rideData: any, hoursLeft: number) {
  const formattedDate = new Date(rideData.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const isUrgent = hoursLeft === 2;

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
      <title>Rappel course PSG - ${hoursLeft}h</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: ${isUrgent ? 'linear-gradient(135deg, #E1000F 0%, #ff4757 100%)' : 'linear-gradient(135deg, #004170 0%, #556bff 100%)'}; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .ride-card { background: ${isUrgent ? '#fef2f2' : '#f1f5f9'}; border-left: 4px solid ${isUrgent ? '#E1000F' : '#004170'}; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .countdown { font-size: 2em; font-weight: bold; color: ${isUrgent ? '#E1000F' : '#004170'}; text-align: center; margin: 20px 0; }
        .location { display: flex; align-items: center; justify-content: space-between; margin: 10px 0; }
        .location-name { font-weight: bold; }
        .waze-btn { background: #00d4aa; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-flex; align-items: center; }
        .waze-btn:hover { background: #00b894; }
        .icon { width: 20px; margin-right: 12px; }
        .highlight { color: ${isUrgent ? '#E1000F' : '#004170'}; font-weight: bold; }
        .notes { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isUrgent ? '🚨' : '⏰'} Rappel course PSG</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${isUrgent ? 'Course dans 2 heures !' : 'Course aujourd\'hui'}</p>
        </div>
        
        <div class="content">
          <div class="countdown">
            ${isUrgent ? '⚡ Dans 2 heures ⚡' : '📅 Aujourd\'hui à ' + rideData.time}
          </div>
          
          <div class="ride-card">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <span class="icon">📅</span>
              <span><strong>Date:</strong> <span class="highlight">${formattedDate}</span></span>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <span class="icon">🕐</span>
              <span><strong>Heure:</strong> <span class="highlight">${rideData.time}</span></span>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <span class="icon">👤</span>
              <span><strong>Joueur:</strong> <span class="highlight">Jordan</span></span>
            </div>
          </div>

          <!-- DÉPART avec Waze -->
          <div style="background: #dcfce7; border: 2px solid #16a34a; padding: 15px; border-radius: 12px; margin: 15px 0;">
            <div class="location">
              <div>
                <div style="font-weight: bold; color: #16a34a;">📍 DÉPART</div>
                <div class="location-name" style="color: #16a34a;">${rideData.departure}</div>
              </div>
              <a href="${departureWaze}" class="waze-btn" target="_blank">🗺️ Waze</a>
            </div>
          </div>

          <!-- DESTINATION avec Waze -->
          <div style="background: #fef2f2; border: 2px solid #E1000F; padding: 15px; border-radius: 12px; margin: 15px 0;">
            <div class="location">
              <div>
                <div style="font-weight: bold; color: #E1000F;">🎯 DESTINATION</div>
                <div class="location-name" style="color: #E1000F;">${rideData.destination}</div>
              </div>
              <a href="${destinationWaze}" class="waze-btn" target="_blank">🗺️ Waze</a>
            </div>
          </div>
          
          ${rideData.notes ? `
            <div class="notes">
              <strong>📝 Notes importantes:</strong><br>
              ${rideData.notes}
            </div>
          ` : ''}
          
          <div style="background: ${isUrgent ? '#fef2f2' : '#dcfce7'}; border: 1px solid ${isUrgent ? '#E1000F' : '#16a34a'}; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <strong style="color: ${isUrgent ? '#E1000F' : '#16a34a'};">
              ${isUrgent ? '🚨 Préparation immédiate !' : '✅ Vérification du planning'}
            </strong>
            ${isUrgent ? '<p style="color: #E1000F; margin: 10px 0;">Clique sur Waze et c\'est parti !</p>' : ''}
          </div>
        </div>
        
        <div class="footer">
          <p>Rappel automatique YSG Transport</p>
          <p>Envoyé le ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Fonction pour envoyer les rappels 10h avant
export async function sendReminders10h() {
  try {
    await connectToDatabase();

    // Chercher les courses dans 10-11h qui n'ont pas eu de rappel 10h
    const now = new Date();
    const in10h = new Date(now.getTime() + 10 * 60 * 60 * 1000);
    const in11h = new Date(now.getTime() + 11 * 60 * 60 * 1000);

    const rides = await Ride.find({
      date: {
        $gte: new Date(in10h.toDateString()),
        $lt: new Date(in11h.toDateString())
      },
      reminder10hSent: false,
      status: { $ne: 'cancelled' }
    });

    for (const ride of rides) {
      // Créer la date/heure exacte de la course
      const [hours, minutes] = ride.time.split(':');
      const rideDateTime = new Date(ride.date);
      rideDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Vérifier si c'est bien dans 10-11h
      const timeDiff = rideDateTime.getTime() - now.getTime();
      const hoursLeft = timeDiff / (1000 * 60 * 60);

      if (hoursLeft >= 9.5 && hoursLeft <= 11) {
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: process.env.DRIVER_EMAIL,
          subject: `⏰ Rappel course PSG - Jordan aujourd'hui à ${ride.time}`,
          html: generateReminderHTML(ride, 10)
        };

        await transporter.sendMail(mailOptions);
        
        ride.reminder10hSent = true;
        await ride.save();

        console.log(`Rappel 10h envoyé pour la course ${ride._id}`);
      }
    }
  } catch (error) {
    console.error('Erreur rappels 10h:', error);
  }
}

// Fonction pour envoyer les rappels 2h avant
export async function sendReminders2h() {
  try {
    await connectToDatabase();

    // Chercher les courses dans 2-3h qui n'ont pas eu de rappel 2h
    const now = new Date();
    const in2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const in3h = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const rides = await Ride.find({
      date: {
        $gte: new Date(in2h.toDateString()),
        $lt: new Date(in3h.toDateString())
      },
      reminder2hSent: false,
      status: { $ne: 'cancelled' }
    });

    for (const ride of rides) {
      // Créer la date/heure exacte de la course
      const [hours, minutes] = ride.time.split(':');
      const rideDateTime = new Date(ride.date);
      rideDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Vérifier si c'est bien dans 2-3h
      const timeDiff = rideDateTime.getTime() - now.getTime();
      const hoursLeft = timeDiff / (1000 * 60 * 60);

      if (hoursLeft >= 1.5 && hoursLeft <= 3) {
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: process.env.DRIVER_EMAIL,
          subject: `🚨 Rappel URGENT - Course PSG dans 2h (${ride.time})`,
          html: generateReminderHTML(ride, 2)
        };

        await transporter.sendMail(mailOptions);
        
        ride.reminder2hSent = true;
        await ride.save();

        console.log(`Rappel 2h envoyé pour la course ${ride._id}`);
      }
    }
  } catch (error) {
    console.error('Erreur rappels 2h:', error);
  }
}

// Fonction pour exécuter tous les rappels
export async function processReminders() {
  console.log('Traitement des rappels YSG Transport...');
  await sendReminders10h();
  await sendReminders2h();
  console.log('Rappels traités.');
}