/* ═══════════════════════════════════════
   global.js — logique commune à toutes les pages
   ═══════════════════════════════════════ */

// Marquer automatiquement le lien actif dans la sidebar
document.addEventListener('DOMContentLoaded', () => {
  const current = location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === current) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
/* ════════ Boutons Topbar globaux ════════ */
document.addEventListener('DOMContentLoaded', () => {

  // Recherche
  const searchBtn = document.querySelector('.icon-btn:nth-child(1)');
  searchBtn?.addEventListener('click', () => {
    const query = prompt('Search patients or data...');
    if (query?.trim()) alert(`Searching: "${query}"`);
  });

  // Notifications → redirige vers settings#notifications
  const notifBtn = document.querySelector('.icon-btn:nth-child(2)');
  notifBtn?.addEventListener('click', () => {
    window.location.href = 'settings.html#notifications';
  });

  // Paramètres → redirige vers settings.html
  const settingsBtn = document.querySelector('.icon-btn:nth-child(3)');
  settingsBtn?.addEventListener('click', () => {
    window.location.href = 'settings.html';
  });

});
/* ════════ Bouton Export Data (Sidebar) ════════ */
document.querySelector('.export-btn')?.addEventListener('click', () => {

  // Détecter la page courante
  const page = location.pathname.split('/').pop();

  let filename = 'OSA_Export';
  let content  = '';

  if (page.includes('dashboard')) {
    filename = 'Dashboard_Export';
    content  = `
================================================
        OSA MONITOR - DASHBOARD DATA EXPORT
================================================
Patient ID    : #8829-X
Exported      : ${new Date().toLocaleString()}

VITAL SIGNS
-----------
Heart Rate    : 72 BPM
SpO2 Level    : 98%
Respiration   : 14 BrPM
Body Temp     : 98.6°F

OSA RISK
--------
Risk Level    : LOW RISK (24%)
AHI Score     : 4.2 events/hour

RECENT EPISODES
---------------
Tonight 01:24 AM  | NORMAL  | SpO2: 98.2% | 0 events | 45m 12s
Tonight 12:38 AM  | NORMAL  | SpO2: 97.8% | 1 event  | 1h 03m
Yesterday 11:50PM | WARNING | SpO2: 95.1% | 3 events | 38m 44s
`;
  } else if (page.includes('apnea')) {
    filename = 'Apnea_Detection_Export';
    content  = `
================================================
      OSA MONITOR - APNEA DETECTION EXPORT
================================================
Session       : Oct 24, 2023 (10:00 PM – 06:30 AM)
Exported      : ${new Date().toLocaleString()}

SUMMARY
-------
Total Events  : 14
Avg. SpO2     : 92%
Longest Event : 42s
AHI Score     : 2.4 (MILD)

ALERTS LOG
----------
10:45 PM | Critical  | 42s | SpO2: 84% | FLAGGED
11:12 PM | Moderate  | 25s | SpO2: 88% | NORMAL
12:35 AM | Critical  | 38s | SpO2: 85% | RESOLVED
02:14 AM | Mild      | 12s | SpO2: 94% | NORMAL
04:45 AM | Moderate  | 28s | SpO2: 89% | NORMAL
`;
  } else if (page.includes('sleep-history')) {
    filename = 'Sleep_History_Export';
    content  = `
================================================
       OSA MONITOR - SLEEP HISTORY EXPORT
================================================
Patient       : Alex Johnson (#4482)
Exported      : ${new Date().toLocaleString()}

STATISTICS
----------
Total Sleep   : 52h 15m
Efficiency    : 88%
Disturbances  : 14 total

EVENT LOG
---------
Nov 04 | AHI: 1.2 Normal | SpO2: 96% | 7h 45m | Excellent
Nov 03 | AHI: 4.8 Mild   | SpO2: 92% | 6h 12m | Good
Nov 02 | AHI: 2.4 Normal | SpO2: 94% | 8h 05m | Poor
`;
  } else if (page.includes('patient')) {
    filename = 'Patient_Profile_Export';
    content  = `
================================================
      OSA MONITOR - PATIENT PROFILE EXPORT
================================================
Patient       : Johnathan Doe
ID            : #88291-JD
Diagnosis     : Sleep Apnea Type II
Physician     : Dr. Sarah Chen
Exported      : ${new Date().toLocaleString()}

DEVICE
------
Model         : SomnoRest Pro v4
Serial        : SNR-7729-BQ
Battery       : 84%
Last Sync     : 4 mins ago
Signal        : -52 dBm

SETTINGS
--------
Auto-Sync     : Enabled
Critical Alerts: Enabled
Family Sharing : Disabled
`;
  } else if (page.includes('settings')) {
    filename = 'Settings_Export';
    content  = `
================================================
        OSA MONITOR - SETTINGS EXPORT
================================================
User          : Dr. Sarah Chen
Exported      : ${new Date().toLocaleString()}

PROFILE
-------
Email         : s.chen@hospital.com
Phone         : +1 (555) 987-6543
Specialization: Sleep Medicine
Hospital      : City General Hospital

THRESHOLDS
----------
Heart Rate High : 100 BPM
Heart Rate Low  : 50 BPM
SpO2 Minimum    : 90%
AHI Score Limit : 15/hr
`;
  } else {
    filename = 'OSA_Data_Export';
    content  = `
================================================
          OSA MONITOR - DATA EXPORT
================================================
Exported      : ${new Date().toLocaleString()}
Page          : ${page || 'Unknown'}

No specific data available for this page.
================================================
`;
  }

  // Télécharger le fichier
  const blob = new Blob([content.trim()], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${filename}_${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  // Feedback visuel
  const btn = document.querySelector('.export-btn');
  const original = btn.innerHTML;
  btn.innerHTML = '✓ Exported!';
  btn.style.background = '#16a34a';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
  }, 2500);

});