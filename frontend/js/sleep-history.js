/* ═══════════════════════════════════════
   sleep-history.js
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════ 1. Calendrier ════════ */
  let currentYear  = 2023;
  let currentMonth = 9; // 0-based → October
  const selectedDay = 5;

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  function renderCalendar(year, month) {
    document.getElementById('calTitle').textContent = `${monthNames[month]} ${year}`;

    const firstDay  = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev  = new Date(year, month, 0).getDate();

    const container = document.getElementById('calDays');
    container.innerHTML = '';

    // Jours du mois précédent
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = document.createElement('div');
      d.className = 'cal-day other';
      d.textContent = daysInPrev - i;
      container.appendChild(d);
    }

    // Jours du mois courant
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      el.className = 'cal-day';
      if (d === selectedDay && month === 9 && year === 2023) el.classList.add('active');
      el.textContent = d;
      el.addEventListener('click', () => {
        document.querySelectorAll('.cal-day.active').forEach(x => x.classList.remove('active'));
        el.classList.add('active');
      });
      container.appendChild(el);
    }

    // Jours du mois suivant
    const total = firstDay + daysInMonth;
    const remaining = total % 7 === 0 ? 0 : 7 - (total % 7);
    for (let d = 1; d <= remaining; d++) {
      const el = document.createElement('div');
      el.className = 'cal-day other';
      el.textContent = d;
      container.appendChild(el);
    }
  }

  renderCalendar(currentYear, currentMonth);

  document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentYear, currentMonth);
  });
  document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentYear, currentMonth);
  });


  /* ════════ 2. Quality Score Chart ════════ */
  const scores = [
    { score: 65, label: 'Oct 29' },
    { score: 72, label: 'Oct 30' },
    { score: 84, label: 'Oct 31' },
    { score: 92, label: 'Nov 01' },
    { score: 78, label: 'Nov 02' },
    { score: 81, label: 'Nov 03' },
    { score: 88, label: 'Nov 04' },
  ];

  const qCanvas = document.getElementById('qualityChart');
  const qCtx    = qCanvas.getContext('2d');

  function resizeQuality() {
    qCanvas.width  = qCanvas.offsetWidth;
    qCanvas.height = 120;
  }
  resizeQuality();
  window.addEventListener('resize', () => { resizeQuality(); drawQuality(); });

  function drawQuality() {
    const w = qCanvas.width, h = qCanvas.height;
    qCtx.clearRect(0, 0, w, h);

    const padding = 20;
    const chartW  = w - padding * 2;
    const maxScore = 100;
    const step = chartW / (scores.length - 1);

    // Ligne de fond
    qCtx.strokeStyle = 'rgba(226,232,240,.5)';
    qCtx.lineWidth = 1;
    [25, 50, 75].forEach(pct => {
      const y = h - (pct / maxScore) * h;
      qCtx.beginPath(); qCtx.moveTo(0, y); qCtx.lineTo(w, y); qCtx.stroke();
    });

    // Zone remplie
    qCtx.beginPath();
    scores.forEach((s, i) => {
      const x = padding + i * step;
      const y = h - (s.score / maxScore) * h;
      i === 0 ? qCtx.moveTo(x, y) : qCtx.lineTo(x, y);
    });
    qCtx.lineTo(padding + (scores.length - 1) * step, h);
    qCtx.lineTo(padding, h);
    qCtx.closePath();
    qCtx.fillStyle = 'rgba(37,99,235,.08)';
    qCtx.fill();

    // Ligne
    qCtx.beginPath();
    scores.forEach((s, i) => {
      const x = padding + i * step;
      const y = h - (s.score / maxScore) * h;
      i === 0 ? qCtx.moveTo(x, y) : qCtx.lineTo(x, y);
    });
    qCtx.strokeStyle = '#2563eb';
    qCtx.lineWidth   = 2;
    qCtx.lineJoin    = 'round';
    qCtx.stroke();

    // Points + valeurs
    scores.forEach((s, i) => {
      const x = padding + i * step;
      const y = h - (s.score / maxScore) * h;
      const isNov01 = s.label === 'Nov 01';

      qCtx.beginPath();
      qCtx.arc(x, y, isNov01 ? 5 : 3.5, 0, Math.PI * 2);
      qCtx.fillStyle = isNov01 ? '#2563eb' : '#fff';
      qCtx.strokeStyle = '#2563eb';
      qCtx.lineWidth = 2;
      qCtx.fill();
      qCtx.stroke();

      // Score au dessus
      qCtx.fillStyle = isNov01 ? '#2563eb' : '#64748b';
      qCtx.font = `${isNov01 ? '700' : '500'} 11px -apple-system, sans-serif`;
      qCtx.textAlign = 'center';
      qCtx.fillText(s.score, x, y - 10);
    });
  }
  drawQuality();

  // Labels
  const labelsEl = document.getElementById('qualityLabels');
  scores.forEach(s => {
    const span = document.createElement('span');
    span.textContent = s.label;
    if (s.label === 'Nov 01') span.style.color = '#2563eb';
    labelsEl.appendChild(span);
  });


  /* ════════ 3. Sleep Donut ════════ */
  const sdCanvas = document.getElementById('sleepDonut');
  const sdCtx    = sdCanvas.getContext('2d');
  const dpr      = window.devicePixelRatio || 1;
  sdCanvas.width  = 90 * dpr;
  sdCanvas.height = 90 * dpr;
  sdCtx.scale(dpr, dpr);

  const slices = [
    { value: 0.25, color: '#1e40af' }, // Deep
    { value: 0.65, color: '#93c5fd' }, // Light
    { value: 0.10, color: '#e2e8f0' }, // Awake
  ];
  let sdProgress = 0;

  function drawSleepDonut(p) {
    sdCtx.clearRect(0, 0, 90, 90);
    let start = -Math.PI / 2;
    slices.forEach(slice => {
      const end = start + Math.PI * 2 * slice.value * p;
      sdCtx.beginPath();
      sdCtx.arc(45, 45, 36, start, end);
      sdCtx.strokeStyle = slice.color;
      sdCtx.lineWidth   = 10;
      sdCtx.lineCap     = 'butt';
      sdCtx.stroke();
      start = end;
    });
  }

  function animateSleepDonut() {
    if (sdProgress < 1) {
      sdProgress = Math.min(sdProgress + .02, 1);
      drawSleepDonut(sdProgress);
      requestAnimationFrame(animateSleepDonut);
    }
  }
  animateSleepDonut();


  /* ════════ 4. HRV Bars ════════ */
  const hrvData = [55, 62, 48, 70, 58, 45, 80, 58];
  const maxHRV  = Math.max(...hrvData);
  const container = document.getElementById('hrvBars');

  hrvData.forEach((val, i) => {
    const bar = document.createElement('div');
    bar.className = 'hrv-bar' + (i === 6 ? ' highlight' : '');
    bar.style.height = '0px';
    container.appendChild(bar);
    setTimeout(() => {
      bar.style.height = `${(val / maxHRV) * 40}px`;
    }, 300 + i * 60);
  });


  /* ════════ 5. Event Log Table ════════ */
  const logData = [
    { date: 'Nov 04, 2023', ahi: '1.2 (Normal)', ahiClass: 'ahi-normal', spo2: '96%', duration: '7h 45m', fit: 'Excellent' },
    { date: 'Nov 03, 2023', ahi: '4.8 (Mild)',   ahiClass: 'ahi-mild',   spo2: '92%', duration: '6h 12m', fit: 'Good'      },
    { date: 'Nov 02, 2023', ahi: '2.4 (Normal)', ahiClass: 'ahi-normal', spo2: '94%', duration: '8h 05m', fit: 'Poor'      },
  ];

  const tbody = document.getElementById('logBody');
  logData.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.date}</td>
      <td><span class="ahi-badge ${row.ahiClass}">${row.ahi}</span></td>
      <td>${row.spo2}</td>
      <td>${row.duration}</td>
      <td>${row.fit}</td>
      <td><a class="view-graphs">View Graphs</a></td>
    `;
    tbody.appendChild(tr);
  });

});
/* ════════ Bouton Export PDF ════════ */
document.querySelector('.btn-outline')?.addEventListener('click', () => {

  const report = `
================================================
       OSA MONITOR - SLEEP HISTORY REPORT
================================================

Patient       : Alex Johnson (ID: #4482)
Generated     : ${new Date().toLocaleString()}
Period        : October - November 2023

------------------------------------------------
SUMMARY STATISTICS
------------------------------------------------
Total Sleep Time   : 52h 15m
Avg. Efficiency    : 88%
Disturbances       : 14 total

------------------------------------------------
SLEEP QUALITY SCORES (Last 7 Days)
------------------------------------------------
Oct 29  : 65/100
Oct 30  : 72/100
Oct 31  : 84/100
Nov 01  : 92/100  ← Best night
Nov 02  : 78/100
Nov 03  : 81/100
Nov 04  : 88/100

------------------------------------------------
DEEP SLEEP BREAKDOWN (Last Session)
------------------------------------------------
Deep Sleep  : 1h 45m  (25%)
Light Sleep : 4h 12m  (65%)
Awake       : 0h 18m  (10%)

------------------------------------------------
HEART RATE VARIABILITY
------------------------------------------------
Avg. HRV    : 58ms     (↑ 4% improvement)

------------------------------------------------
DETAILED EVENT LOG
------------------------------------------------
Nov 04, 2023 | AHI: 1.2 Normal  | SpO2: 96% | 7h 45m | Mask: Excellent
Nov 03, 2023 | AHI: 4.8 Mild    | SpO2: 92% | 6h 12m | Mask: Good
Nov 02, 2023 | AHI: 2.4 Normal  | SpO2: 94% | 8h 05m | Mask: Poor

------------------------------------------------
CLINICAL RECOMMENDATION
------------------------------------------------
Sleep quality showing consistent improvement.
Continue current CPAP therapy.
Next review scheduled in 6 weeks.

================================================
  OSA Monitor v2.4 | HIPAA Compliant
  Generated automatically - Not for diagnosis
================================================
`;

  const blob = new Blob([report], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `Sleep_History_Report_${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  // Feedback visuel
  const btn = document.querySelector('.btn-outline');
  const original = btn.innerHTML;
  btn.innerHTML = '✓ Exported';
  btn.style.background = '#dcfce7';
  btn.style.color = '#16a34a';
  btn.style.borderColor = '#16a34a';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style = '';
  }, 2500);
});


/* ════════ Bouton Share with Doctor ════════ */
document.querySelector('.btn-primary')?.addEventListener('click', () => {

  // Simuler l'envoi
  const btn = document.querySelector('.btn-primary');
  const original = btn.innerHTML;

  btn.innerHTML = '⏳ Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '✓ Shared Successfully';
    btn.style.background = '#16a34a';

    // Notification dans la page
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed; bottom: 24px; right: 24px;
      background: #0f172a; color: #fff;
      padding: 14px 20px; border-radius: 12px;
      font-size: 13px; font-weight: 600;
      box-shadow: 0 4px 20px rgba(0,0,0,.2);
      z-index: 999; animation: fadeUp .3s ease;
    `;
    notif.innerHTML = `
      ✓ Report shared with <strong>Dr. Sarah Chen</strong><br>
      <span style="font-size:11px;color:#94a3b8">s.chen@hospital.com • Just now</span>
    `;
    document.body.appendChild(notif);

    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
      notif.remove();
    }, 3000);
  }, 1500);

});