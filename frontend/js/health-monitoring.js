/* ═══════════════════════════════════════
   health-monitoring.js
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── AHI History ── */
  const ahiData = [
    { date: 'Nov 04', score: 2.4, color: '#16a34a' },
    { date: 'Nov 03', score: 4.8, color: '#ca8a04' },
    { date: 'Nov 02', score: 3.1, color: '#16a34a' },
    { date: 'Nov 01', score: 6.2, color: '#ea580c' },
    { date: 'Oct 31', score: 4.0, color: '#ca8a04' },
  ];

  const ahiList = document.getElementById('ahiList');
  if (ahiList) {
    ahiData.forEach(item => {
      const div = document.createElement('div');
      div.className = 'ahi-row-item';
      div.innerHTML = `
        <span class="ahi-date">${item.date}</span>
        <div class="ahi-bar-wrap">
          <div class="ahi-bar-inner" style="width:0%;background:${item.color}" data-width="${(item.score/15)*100}%"></div>
        </div>
        <span class="ahi-score" style="color:${item.color}">${item.score}</span>
      `;
      ahiList.appendChild(div);
    });

    setTimeout(() => {
      document.querySelectorAll('.ahi-bar-inner').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }, 300);
  }

  /* ── Sleep Quality Trend Chart ── */
  const trendCanvas = document.getElementById('trendChart');
  if (trendCanvas) {
    const ctx = trendCanvas.getContext('2d');
    const scores = [65, 72, 84, 78, 92, 81, 88];
    const labels = ['Oct 29','Oct 30','Oct 31','Nov 01','Nov 02','Nov 03','Nov 04'];

    function drawTrend() {
      trendCanvas.width  = trendCanvas.offsetWidth;
      trendCanvas.height = 120;
      const w = trendCanvas.width, h = 120;
      const pad = 20, step = (w - pad*2) / (scores.length - 1);

      ctx.clearRect(0,0,w,h);

      // Fill
      ctx.beginPath();
      scores.forEach((s,i) => {
        const x = pad + i*step, y = h - (s/100)*h;
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      });
      ctx.lineTo(pad+(scores.length-1)*step, h);
      ctx.lineTo(pad, h); ctx.closePath();
      ctx.fillStyle = 'rgba(37,99,235,.08)'; ctx.fill();

      // Line
      ctx.beginPath();
      scores.forEach((s,i) => {
        const x = pad+i*step, y = h-(s/100)*h;
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      });
      ctx.strokeStyle='#2563eb'; ctx.lineWidth=2; ctx.lineJoin='round'; ctx.stroke();

      // Dots
      scores.forEach((s,i) => {
        const x=pad+i*step, y=h-(s/100)*h;
        ctx.beginPath(); ctx.arc(x,y,3.5,0,Math.PI*2);
        ctx.fillStyle='#fff'; ctx.strokeStyle='#2563eb'; ctx.lineWidth=2;
        ctx.fill(); ctx.stroke();
      });
    }
    drawTrend();
    window.addEventListener('resize', drawTrend);
  }

  /* ── SpO2 Chart ── */
  const spo2Canvas = document.getElementById('spo2Chart');
  if (spo2Canvas) {
    const ctx = spo2Canvas.getContext('2d');
    const data = [98,97,96,98,95,97,99,98,96,97,98,97,96,98];

    function drawSpo2() {
      spo2Canvas.width  = spo2Canvas.offsetWidth;
      spo2Canvas.height = 120;
      const w = spo2Canvas.width, h = 120;
      const pad = 10, step = (w - pad*2) / (data.length - 1);

      ctx.clearRect(0,0,w,h);

      // Threshold line (90%)
      const threshY = h - ((90-88)/(100-88))*h;
      ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(0,threshY); ctx.lineTo(w,threshY);
      ctx.strokeStyle='#dc2626'; ctx.lineWidth=1; ctx.stroke();
      ctx.setLineDash([]);

      // Fill
      ctx.beginPath();
      data.forEach((s,i) => {
        const x=pad+i*step, y=h-((s-88)/(100-88))*h;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      });
      ctx.lineTo(pad+(data.length-1)*step,h); ctx.lineTo(pad,h); ctx.closePath();
      ctx.fillStyle='rgba(37,99,235,.08)'; ctx.fill();

      // Line
      ctx.beginPath();
      data.forEach((s,i) => {
        const x=pad+i*step, y=h-((s-88)/(100-88))*h;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      });
      ctx.strokeStyle='#2563eb'; ctx.lineWidth=2; ctx.lineJoin='round'; ctx.stroke();
    }
    drawSpo2();
    window.addEventListener('resize', drawSpo2);
  }

  /* ── Alert List ── */
  const alerts = [
    { type:'critical', msg:'SpO2 dropped to 84% — Critical apnea event detected', time:'10:45 PM' },
    { type:'moderate', msg:'AHI exceeded threshold — 6 events in 1 hour', time:'11:12 PM' },
    { type:'mild',     msg:'Minor desaturation event (92%) resolved automatically', time:'02:14 AM' },
  ];

  const alertList = document.getElementById('alertList');
  if (alertList) {
    alerts.forEach(a => {
      const div = document.createElement('div');
      div.className = 'alert-item';
      div.innerHTML = `
        <span class="alert-dot ${a.type}"></span>
        <span class="alert-msg">${a.msg}</span>
        <span class="alert-time">${a.time}</span>
      `;
      alertList.appendChild(div);
    });
  }
});
