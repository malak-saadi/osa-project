/* ═══════════════════════════════════════
   clinical-notes.js
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const notes = [
    {
      id: 1, date: 'Oct 24, 2023', doctor: 'Dr. Sarah Chen', dept: 'Cardiology',
      title: 'Follow-up Visit – Oct 24, 2023',
      preview: 'Patient reported improved sleep quality...',
      tag: 'Follow-up',
      body: `Patient reported improved sleep quality since last CPAP adjustment. AHI has decreased from 12.4 to 4.2 over the past 3 weeks. SpO2 saturation remains stable at 97-98% throughout the night.\n\nRecommendations:\n• Continue current CPAP pressure settings (8-12 cmH2O)\n• Schedule follow-up in 6 weeks\n• Monitor for mask leak events\n• Patient should maintain sleep diary\n\nNext appointment scheduled for Dec 5, 2023.`,
      tags: ['CPAP', 'Follow-up', 'AHI Improvement'],
    },
    {
      id: 2, date: 'Oct 10, 2023', doctor: 'Dr. Sarah Chen', dept: 'Sleep Medicine',
      title: 'Initial Assessment – Oct 10, 2023',
      preview: 'New patient evaluation for suspected OSA...',
      tag: 'Assessment',
      body: `New patient evaluation for suspected obstructive sleep apnea. Patient reports chronic snoring, daytime fatigue, and 3 awakenings per night on average.\n\nPolysomnography ordered. BMI: 28.4. No significant cardiac history.\n\nInitial CPAP trial prescribed at 10 cmH2O. Follow-up in 2 weeks.`,
      tags: ['Initial Visit', 'Polysomnography', 'CPAP'],
    },
    {
      id: 3, date: 'Sep 28, 2023', doctor: 'Dr. Mark Lee', dept: 'Pulmonology',
      title: 'Pulmonology Consult – Sep 28, 2023',
      preview: 'Referred for evaluation of respiratory function...',
      tag: 'Consultation',
      body: `Referred for evaluation of respiratory function in context of sleep apnea diagnosis. Spirometry results within normal range. No evidence of COPD or restrictive lung disease.\n\nConclusion: Sleep apnea is not complicated by pulmonary comorbidity. Continue CPAP management as primary intervention.`,
      tags: ['Pulmonology', 'Spirometry', 'Consult'],
    },
  ];

  const list = document.getElementById('notesList');
  const detailTitle = document.getElementById('detailTitle');
  const detailMeta  = document.getElementById('detailMeta');
  const detailBody  = document.getElementById('detailBody');
  const tagsEl      = document.querySelector('.cn-tags');

  function renderNotes(filter = '') {
    list.innerHTML = '';
    notes
      .filter(n => n.title.toLowerCase().includes(filter) || n.body.toLowerCase().includes(filter))
      .forEach((n, i) => {
        const div = document.createElement('div');
        div.className = 'cn-note-item' + (i === 0 && !filter ? ' active' : '');
        div.innerHTML = `
          <div class="cn-note-date">${n.date}</div>
          <div class="cn-note-title">${n.title}</div>
          <div class="cn-note-preview">${n.preview}</div>
          <span class="cn-note-tag">${n.tag}</span>
        `;
        div.addEventListener('click', () => {
          document.querySelectorAll('.cn-note-item').forEach(x => x.classList.remove('active'));
          div.classList.add('active');
          detailTitle.textContent = n.title;
          detailMeta.textContent  = `${n.doctor} • ${n.dept}`;
          detailBody.textContent  = n.body;
          tagsEl.innerHTML = n.tags.map(t => `<span class="cn-tag">${t}</span>`).join('');
        });
        list.appendChild(div);
      });
  }

  renderNotes();

  // Search
  document.getElementById('noteSearch').addEventListener('input', e => {
    renderNotes(e.target.value.toLowerCase());
  });

  // Add Note
  document.getElementById('addNoteBtn').addEventListener('click', () => {
    const title = prompt('Note title:');
    if (!title) return;
    const body = prompt('Note content:');
    notes.unshift({
      id: Date.now(), date: new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}),
      doctor: 'Dr. Sarah Chen', dept: 'General',
      title, preview: body.substring(0,60) + '...', tag: 'Note',
      body, tags: ['New'],
    });
    renderNotes();
  });
});
