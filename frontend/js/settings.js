/* ═══════════════════════════════════════
   settings.js
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════ 1. Menu Navigation ════════ */
  const menuItems = document.querySelectorAll('.menu-item');
  const sections  = document.querySelectorAll('.section');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(m => m.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      item.classList.add('active');
      const target = document.getElementById('section-' + item.dataset.section);
      if (target) target.classList.add('active');
    });
  });


  /* ════════ 2. Theme Selector ════════ */
  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });


  /* ════════ 3. Alert Thresholds ════════ */
  const thresholds = [
    { icon: '❤️', bg: '#fee2e2', name: 'Heart Rate (High)',     desc: 'Alert when BPM exceeds limit',     value: 100, unit: 'BPM',  min: 60,  max: 200 },
    { icon: '❤️', bg: '#fee2e2', name: 'Heart Rate (Low)',      desc: 'Alert when BPM drops below limit', value: 50,  unit: 'BPM',  min: 30,  max: 80  },
    { icon: '💧', bg: '#dbeafe', name: 'SpO2 Minimum',          desc: 'Alert when oxygen drops below',    value: 90,  unit: '%',    min: 80,  max: 98  },
    { icon: '📊', bg: '#dcfce7', name: 'AHI Score Limit',       desc: 'Alert when AHI exceeds value',     value: 15,  unit: '/hr',  min: 5,   max: 30  },
    { icon: '🌬️', bg: '#dcfce7', name: 'Respiration Rate',      desc: 'Alert when BrPM is abnormal',      value: 20,  unit: 'BrPM', min: 8,   max: 30  },
    { icon: '🌡️', bg: '#fff7ed', name: 'Body Temperature',      desc: 'Alert on fever detection',         value: 99.5, unit: '°F', min: 97,  max: 104 },
  ];

  const thresholdList = document.getElementById('thresholdList');
  if (thresholdList) {
    thresholds.forEach(t => {
      const div = document.createElement('div');
      div.className = 'threshold-item';
      div.innerHTML = `
        <div class="threshold-icon" style="background:${t.bg}">${t.icon}</div>
        <div class="threshold-info">
          <div class="threshold-name">${t.name}</div>
          <div class="threshold-desc">${t.desc}</div>
        </div>
        <div class="threshold-input-wrap">
          <input type="number" class="threshold-input" value="${t.value}" min="${t.min}" max="${t.max}">
          <span class="threshold-unit">${t.unit}</span>
        </div>
      `;
      thresholdList.appendChild(div);
    });
  }

  document.getElementById('resetThresholds')?.addEventListener('click', () => {
    document.querySelectorAll('.threshold-input').forEach((input, i) => {
      input.value = thresholds[i].value;
    });
    showToast('✓ Thresholds reset to defaults');
  });


  /* ════════ 4. Connected Devices ════════ */
  const devices = [
    { name: 'SomnoRest Pro v4', meta: 'Serial: SNR-7729-BQ • Last sync: 4 mins ago', connected: true },
    { name: 'SomnoRest Mini v2', meta: 'Serial: SNR-4421-AX • Last sync: 3 days ago', connected: false },
  ];

  const deviceList = document.getElementById('deviceList');
  if (deviceList) {
    devices.forEach(d => {
      const div = document.createElement('div');
      div.className = 'device-item';
      div.innerHTML = `
        <div class="device-item-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
        </div>
        <div>
          <div class="device-item-name">${d.name}</div>
          <div class="device-item-meta">${d.meta}</div>
        </div>
        <span class="device-item-status ${d.connected ? 'status-connected' : 'status-disconnected'}">
          ${d.connected ? 'Connected' : 'Disconnected'}
        </span>
        <button class="device-remove" title="Remove device">✕</button>
      `;
      div.querySelector('.device-remove').addEventListener('click', () => {
        if (confirm(`Remove ${d.name}?`)) div.remove();
      });
      deviceList.appendChild(div);
    });
  }


  /* ════════ 5. Active Sessions ════════ */
  const sessions = [
    { device: 'Chrome on Windows 11', meta: 'Paris, France • Active now', current: true },
    { device: 'Safari on iPhone 15',  meta: 'Paris, France • 2 hours ago', current: false },
    { device: 'Firefox on MacBook',   meta: 'Lyon, France • Yesterday',    current: false },
  ];

  const sessionList = document.getElementById('sessionList');
  if (sessionList) {
    sessions.forEach(s => {
      const div = document.createElement('div');
      div.className = 'session-item';
      div.innerHTML = `
        <div class="session-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <div>
          <div class="session-device">${s.device}</div>
          <div class="session-meta">${s.meta}</div>
        </div>
        ${s.current
          ? '<span class="session-current">Current</span>'
          : '<button class="session-revoke">Revoke</button>'
        }
      `;
      if (!s.current) {
        div.querySelector('.session-revoke').addEventListener('click', () => {
          div.remove();
          showToast('✓ Session revoked');
        });
      }
      sessionList.appendChild(div);
    });
  }


  /* ════════ 6. Password Update ════════ */
  document.getElementById('updatePassBtn')?.addEventListener('click', () => {
    const newPass     = document.getElementById('newPass')?.value;
    const confirmPass = document.getElementById('confirmPass')?.value;
    if (!newPass)              { showToast('⚠ Enter a new password'); return; }
    if (newPass !== confirmPass) { showToast('⚠ Passwords do not match'); return; }
    showToast('✓ Password updated successfully');
    document.querySelectorAll('input[type="password"]').forEach(i => i.value = '');
  });


  /* ════════ 7. Save Buttons ════════ */
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', () => showToast('✓ Settings saved successfully'));
  });


  /* ════════ Toast ════════ */
  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

});
/* ════════ Boutons Topbar ════════ */

// 1. Bouton Recherche 🔍
document.querySelector('.icon-btn:nth-child(1)')?.addEventListener('click', () => {
  const query = prompt('Search patients or data...');
  if (query && query.trim()) {
    // Tu peux remplacer cette ligne par une vraie logique de recherche
    alert(`Searching for: "${query}"`);
  }
});

// 2. Bouton Notifications 🔔
document.querySelector('.icon-btn:nth-child(2)')?.addEventListener('click', () => {
  // Naviguer vers la section notifications dans settings
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  const notifMenu = document.querySelector('[data-section="notifications"]');
  const notifSection = document.getElementById('section-notifications');

  if (notifMenu && notifSection) {
    notifMenu.classList.add('active');
    notifSection.classList.add('active');
    notifSection.scrollIntoView({ behavior: 'smooth' });
  }
});

// 3. Bouton Paramètres ⚙️ (roue dentée)
document.querySelector('.icon-btn:nth-child(3)')?.addEventListener('click', () => {
  // Déjà sur la page settings — scroll vers le haut
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
/* ════════ Ouvrir section via URL hash ════════ */
const hash = window.location.hash.replace('#', '');
if (hash) {
  const targetMenu    = document.querySelector(`[data-section="${hash}"]`);
  const targetSection = document.getElementById(`section-${hash}`);
  if (targetMenu && targetSection) {
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    targetMenu.classList.add('active');
    targetSection.classList.add('active');
  }
}