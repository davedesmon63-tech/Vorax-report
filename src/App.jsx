import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// REMPLACE PAR TES VRAIES CLÉS SUPABASE
const supabase = createClient('https://xxx.supabase.co', 'ta-cle-publique-ici')

function App() {
  const [numero, setNumero] = useState('')
  const [details, setDetails] = useState('')
  const [gmailLink, setGmailLink] = useState('')

  const types = {
    spam: { label: 'Spam', emoji: '🚨', color: '#FFA500' },
    scam: { label: 'Arnaque', emoji: '💸', color: '#DC2626' },
    abuse: { label: 'Abus', emoji: '👮', color: '#7C3AED' }
  }

  const generateGmailLink = (type) => {
    const supportEmail = 'support@whatsapp.com';
    const subject = `[report] WhatsApp +${numero} - ${types[type].label}`;
    const body = `Bonjour équipe WhatsApp,

Je signale le numéro: +${numero}
Type: ${types[type].label}
Détails: ${details}

Merci de traiter ce signalement.`;

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${supportEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const handleReport = async (type) => {
    if(!numero) return alert('Entre un numéro d\'abord!');

    // Sauvegarde dans Supabase
    await supabase.from('scammers').insert([{
      numero: numero.replace(/\D/g,''),
      raison: types[type].label,
      details,
      reporters: 1,
      date: new Date()
    }]);

    setGmailLink(generateGmailLink(type));
  }

  return (
    <div style={{maxWidth: 500, margin: '40px auto', padding: 20, fontFamily: 'system-ui'}}>
      <h1>🚨 vorax-report</h1>
      <p>ban en 10s</p>

      <input
        placeholder="+225 07 01 01 01"
        value={numero}
        onChange={e => setNumero(e.target.value)}
        style={{width: '100%', padding: 12, marginBottom: 10, fontSize: 16}}
      />

      <textarea
        placeholder="Que s'est-il passé? Ex: Fausse vente iPhone"
        value={details}
        onChange={e => setDetails(e.target.value)}
        rows={3}
        style={{width: '100%', padding: 12, marginBottom: 20, fontSize: 16}}
      />

      <div style={{display: 'flex', gap: 10}}>
        {Object.keys(types).map(type => (
          <button key={type} onClick={() => handleReport(type)}
            style={{flex:1, padding: 15, background: types[type].color, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer'}}>
            {types[type].emoji} {types[type].label}
          </button>
        ))}
      </div>

      {gmailLink && (
        <div style={{marginTop: 30, padding: 20, background: '#F3F4F6', borderRadius: 8}}>
          <a href={gmailLink} target="_blank"
            style={{display: 'block', padding: 15, background: '#4285F4', color: 'white', textAlign: 'center', textDecoration: 'none', borderRadius: 8}}>
            📧 Envoyer à WhatsApp Support
          </a>
        </div>
      )}
    </div>
  )
}

export default App
