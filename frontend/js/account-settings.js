/* ═══════════════════════════════════════
   account-settings.js
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Toast notification ── */
  const toast = document.createElement('div');
  toast.className = 'save-toast';
  toast.textContent = '✓ Changes saved successfully';
  document.body.appendChild(toast);

  function showToast(msg = '✓ Changes saved successfully') {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  /* ── Save Personal Info ── */
  const savePersonal = document.getElementById('savePersonal');
  if (savePersonal) {
    savePersonal.addEventListener('click', () => showToast('✓ Personal information saved'));
  }

  /* ── Save Password ── */
  const savePassword = document.getElementById('savePassword');
  if (savePassword) {
    savePassword.addEventListener('click', () => {
      const inputs = document.querySelectorAll('input[type="password"]');
      const newPass = inputs[1]?.value;
      const confirm = inputs[2]?.value;
      if (!newPass) { showToast('⚠ Please enter a new password'); return; }
      if (newPass !== confirm) { showToast('⚠ Passwords do not match'); return; }
      showToast('✓ Password updated successfully');
      inputs.forEach(i => i.value = '');
    });
  }

  /* ── Danger buttons ── */
  document.querySelectorAll('.btn-danger-outline').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Are you sure you want to deactivate this account?')) {
        showToast('Account deactivated');
      }
    });
  });

  document.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('This will permanently delete all patient data. Continue?')) {
        showToast('Account deleted');
      }
    });
  });

});
