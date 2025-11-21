// app/api/reminders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { processReminders } from '../../../lib/reminders';

export async function GET(request: NextRequest) {
  try {
    // Vérifier un token secret pour sécuriser (optionnel)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET || 'psg-transport-cron';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await processReminders();

    return NextResponse.json({ 
      success: true, 
      message: 'Rappels traités avec succès',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur API reminders:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement des rappels' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Même logique que GET pour permettre les deux méthodes
  return GET(request);
}