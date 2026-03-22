/* ═══════════════════════════════════════
   patient-profile.js
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════ 1. Barre batterie ════════ */
  setTimeout(() => {
    const bar = document.getElementById('batteryBar');
    if (bar) bar.style.width = '84%';
  }, 300);


  /* ════════ 2. Data Transmission Log ════════ */
  const logs = [
    {
      type: 'success',
      icon: '↻',
      title: 'Nightly Sleep Data Upload',
      meta: 'Oct 26, 2023 at 07:12 AM • 4.2 MB uploaded',
      status: 'Successful',
      statusClass: 'status-success',
    },
    {
      type: 'success',
      icon: '↻',
      title: 'Nightly Sleep Data Upload',
      meta: 'Oct 25, 2023 at 07:45 AM • 3.8 MB uploaded',
      status: 'Successful',
      statusClass: 'status-success',
    },
    {
      type: 'error',
      icon: '↻',
      title: 'Calibration Update',
      meta: 'Oct 24, 2023 at 11:20 PM • Timeout Error',
      status: 'retry',
      statusClass: 'status-error',
    },
  ];

  const logList = document.getElementById('logList');
  if (logList) {
    logs.forEach(log => {
      const div = document.createElement('div');
      div.className = 'log-item';

      const actionHTML = log.status === 'retry'
        ? `<button class="retry-btn">Retry Now</button>`
        : `<span class="log-status ${log.statusClass}">${log.status}</span>`;

      div.innerHTML = `
        <div class="log-icon ${log.type}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${log.type === 'success' ? '#16a34a' : '#dc2626'}" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </div>
        <div class="log-body">
          <div class="log-title">${log.title}</div>
          <div class="log-meta">${log.meta}</div>
        </div>
        ${actionHTML}
      `;
      logList.appendChild(div);
    });
  }


  /* ════════ 3. Toggle switches ════════ */
  window.toggleSwitch = function(el) {
    el.classList.toggle('on');
  };


  /* ════════ 4. Tabs ════════ */
  window.switchTab = function(name) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const clicked = [...document.querySelectorAll('.tab')].find(t =>
      t.getAttribute('onclick').includes(name)
    );
    if (clicked) clicked.classList.add('active');
  };

});
