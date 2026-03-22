/* ═══════════════════════════════════════
   apnea-detection.js
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════ Données des alertes ════════ */
  const alerts = [
    { time: '10:45 PM', severity: 'Critical',  severityClass: 'dot-red',    duration: '42s', spo2: '84%', spo2Color: '#dc2626', spo2Width: '84%', status: 'FLAGGED',  statusClass: 'status-flagged'  },
    { time: '11:12 PM', severity: 'Moderate',  severityClass: 'dot-orange', duration: '25s', spo2: '88%', spo2Color: '#ea580c', spo2Width: '88%', status: 'NORMAL',   statusClass: 'status-normal'   },
    { time: '12:35 AM', severity: 'Critical',  severityClass: 'dot-red',    duration: '38s', spo2: '85%', spo2Color: '#dc2626', spo2Width: '85%', status: 'RESOLVED', statusClass: 'status-resolved' },
    { time: '02:14 AM', severity: 'Mild',      severityClass: 'dot-green',  duration: '12s', spo2: '94%', spo2Color: '#16a34a', spo2Width: '94%', status: 'NORMAL',   statusClass: 'status-normal'   },
    { time: '04:45 AM', severity: 'Moderate',  severityClass: 'dot-orange', duration: '28s', spo2: '89%', spo2Color: '#ea580c', spo2Width: '89%', status: 'NORMAL',   statusClass: 'status-normal'   },
  ];

  /* ════════ Générer le tableau ════════ */
  const tbody = document.getElementById('alertsBody');
  if (tbody) {
    alerts.forEach(alert => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${alert.time}</td>
        <td>
          <span class="sev-dot">
            <span class="dot ${alert.severityClass}"></span>
            ${alert.severity}
          </span>
        </td>
        <td>${alert.duration}</td>
        <td>
          <div class="spo2-cell">
            <span class="spo2-val" style="color:${alert.spo2Color}">${alert.spo2}</span>
            <div class="spo2-bar" style="background:${alert.spo2Color};width:${alert.spo2Width};max-width:60px;"></div>
          </div>
        </td>
        <td><span class="status-badge ${alert.statusClass}">${alert.status}</span></td>
        <td><a class="review-link">Review</a></td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ════════ Animer les barres des stat cards ════════ */
  // Les barres sont déjà définies en HTML avec leur largeur cible
  // On les anime depuis 0 via un petit délai
  document.querySelectorAll('.stat-bar-fill').forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = targetWidth; }, 300);
  });

});
