/* ═══════════════════════════════════════
   dashboard.js — logique du dashboard
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════ 1. ECG Waveform ════════ */
  const ecgCanvas = document.getElementById('ecgCanvas');
  const ecgCtx    = ecgCanvas.getContext('2d');
  let   ecgOffset = 0;

  function resizeECG() {
    ecgCanvas.width  = ecgCanvas.offsetWidth;
    ecgCanvas.height = ecgCanvas.offsetHeight;
  }
  resizeECG();
  window.addEventListener('resize', resizeECG);

  function ecgPoint(x) {
    const t = (x + ecgOffset * .5) % 140;
    if (t < 20)  return 0;
    if (t < 25)  return -(t - 20) * 3;
    if (t < 30)  return -15 + (t - 25) * 12;
    if (t < 32)  return 45 - (t - 30) * 10;
    if (t < 35)  return 25 - (t - 32) * 20;
    if (t < 40)  return -35 + (t - 35) * 8.5;
    if (t < 50)  return (t - 40) * 2 - 8;
    if (t < 55)  return 12 - (t - 50) * 2.4;
    return 0;
  }

  function drawECG() {
    const w = ecgCanvas.width;
    const h = ecgCanvas.height;
    ecgCtx.clearRect(0, 0, w, h);

    // Grille
    ecgCtx.strokeStyle = 'rgba(226,232,240,.6)';
    ecgCtx.lineWidth = .5;
    for (let x = 0; x < w; x += 20) {
      ecgCtx.beginPath(); ecgCtx.moveTo(x, 0); ecgCtx.lineTo(x, h); ecgCtx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ecgCtx.beginPath(); ecgCtx.moveTo(0, y); ecgCtx.lineTo(w, y); ecgCtx.stroke();
    }

    // Zone colorée sous la courbe
    ecgCtx.beginPath();
    ecgCtx.moveTo(0, h / 2);
    for (let x = 0; x < w; x++) {
      const y = h / 2 - ecgPoint(x) * 1.6;
      x === 0 ? ecgCtx.moveTo(x, y) : ecgCtx.lineTo(x, y);
    }
    ecgCtx.lineTo(w, h / 2);
    ecgCtx.closePath();
    ecgCtx.fillStyle = 'rgba(37,99,235,.06)';
    ecgCtx.fill();

    // Ligne ECG
    ecgCtx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = h / 2 - ecgPoint(x) * 1.6;
      x === 0 ? ecgCtx.moveTo(x, y) : ecgCtx.lineTo(x, y);
    }
    ecgCtx.strokeStyle = '#2563eb';
    ecgCtx.lineWidth   = 1.8;
    ecgCtx.lineJoin    = 'round';
    ecgCtx.stroke();

    ecgOffset++;
    requestAnimationFrame(drawECG);
  }
  drawECG();


  /* ════════ 2. Donut OSA Risk ════════ */
  const donutCanvas = document.getElementById('donutCanvas');
  const donutCtx    = donutCanvas.getContext('2d');
  const dpr         = window.devicePixelRatio || 1;
  donutCanvas.width  = 160 * dpr;
  donutCanvas.height = 160 * dpr;
  donutCtx.scale(dpr, dpr);

  const cx = 80, cy = 80, radius = 60, lineWidth = 12;
  const targetPct = 0.24;
  let   progress  = 0;

  function drawDonut(p) {
    donutCtx.clearRect(0, 0, 160, 160);
    // Fond gris
    donutCtx.beginPath();
    donutCtx.arc(cx, cy, radius, 0, Math.PI * 2);
    donutCtx.strokeStyle = '#e2e8f0';
    donutCtx.lineWidth   = lineWidth;
    donutCtx.stroke();
    // Arc bleu
    donutCtx.beginPath();
    donutCtx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p);
    donutCtx.strokeStyle = '#2563eb';
    donutCtx.lineWidth   = lineWidth;
    donutCtx.lineCap     = 'round';
    donutCtx.stroke();
  }

  function animateDonut() {
    if (progress < targetPct) {
      progress = Math.min(progress + .005, targetPct);
      drawDonut(progress);
      requestAnimationFrame(animateDonut);
    }
  }
  animateDonut();


  /* ════════ 3. Barre AHI ════════ */
  setTimeout(() => {
    const ahiBar = document.getElementById('ahiBar');
    if (ahiBar) ahiBar.style.width = '14%';
  }, 400);


  /* ════════ 4. Tableau des épisodes ════════ */
  const episodes = [
    { time: 'Tonight, 01:24 AM',      status: 'NORMAL',  spo2: '98.2%', events: '0 events', duration: '45m 12s' },
    { time: 'Tonight, 12:38 AM',      status: 'NORMAL',  spo2: '97.8%', events: '1 event',  duration: '1h 03m'  },
    { time: 'Yesterday, 11:50 PM',    status: 'WARNING', spo2: '95.1%', events: '3 events', duration: '38m 44s' },
    { time: 'Yesterday, 10:15 PM',    status: 'NORMAL',  spo2: '98.0%', events: '0 events', duration: '52m 30s' },
  ];

  const tbody = document.getElementById('episodesBody');
  if (tbody) {
    episodes.forEach(ep => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${ep.time}</td>
        <td><span class="ep-status ${ep.status === 'WARNING' ? 'warning' : ''}">${ep.status}</span></td>
        <td>${ep.spo2}</td>
        <td>${ep.events}</td>
        <td>${ep.duration}</td>
        <td><button class="ep-dot-btn">···</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

});
/* ════════ Bouton Medical Report ════════ */
document.querySelector('.report-btn')?.addEventListener('click', () => {

  // Données du rapport
  const report = `
================================================
         OSA MONITOR - MEDICAL REPORT
================================================

Patient ID    : #8829-X
Generated     : ${new Date().toLocaleString()}
Report Type   : Sleep Apnea Analysis Summary

------------------------------------------------
VITAL SIGNS (Current Session)
------------------------------------------------
Heart Rate    : 72 BPM        (+2% vs average)
SpO2 Level    : 98%           (-1% drop detected)
Respiration   : 14 BrPM       (Stable)
Body Temp     : 98.6°F        (Normal)

------------------------------------------------
OSA RISK ASSESSMENT
------------------------------------------------
Risk Level    : LOW RISK
AHI Score     : 4.2 events/hour
OSA Probability: 24%

Status: Current metrics indicate normal sleep
patterns. No immediate clinical intervention
required.

------------------------------------------------
RECENT SLEEP EPISODES
------------------------------------------------
Tonight 01:24 AM  | NORMAL  | SpO2: 98.2% | 0 events | 45m 12s
Tonight 12:38 AM  | NORMAL  | SpO2: 97.8% | 1 event  | 1h 03m
Yesterday 11:50PM | WARNING | SpO2: 95.1% | 3 events | 38m 44s
Yesterday 10:15PM | NORMAL  | SpO2: 98.0% | 0 events | 52m 30s

------------------------------------------------
ECG STATUS
------------------------------------------------
Lead II Visualization : Active
Signal Quality        : Good
Last Reading          : NOW

------------------------------------------------
CLINICAL NOTES
------------------------------------------------
All parameters within acceptable range.
Recommend continued monitoring.
Follow-up appointment advised in 4 weeks.

================================================
  OSA Monitor v2.4 | HIPAA Compliant
  Generated automatically - Not for diagnosis
================================================
`;

  // Créer et télécharger le fichier
  const blob = new Blob([report], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `Medical_Report_8829X_${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  // Feedback visuel
  const btn = document.querySelector('.report-btn');
  const original = btn.innerHTML;
  btn.innerHTML = '✓ Report Downloaded';
  btn.style.background = '#16a34a';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
  }, 2500);

});