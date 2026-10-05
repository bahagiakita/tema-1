/* ============================================================
   Earthy Botanical — js/script_form.js
   RSVP form submit, edit, delete + fetch messages
   Graceful fallback if Supabase not connected
   ============================================================ */

(function () {
  'use strict';

  var rsvpForm = document.getElementById('rsvp-form');
  var guestName = document.getElementById('guest-name');
  var attendance = document.getElementById('attendance');
  var messageInput = document.getElementById('message');
  var charCounter = document.getElementById('char-counter');
  var charWarning = document.getElementById('char-warning');
  var guestMessages = document.getElementById('guest-messages');
  var loadMoreBtn = document.getElementById('load-more-btn');
  var submitBtn = document.getElementById('rsvp-submit-btn') || (rsvpForm ? rsvpForm.querySelector('button[type="submit"]') : null);
  var cancelEditBtn = document.getElementById('cancel-edit-btn');
  var editIndicator = document.getElementById('rsvp-edit-indicator');
  var editIndicatorClose = document.getElementById('edit-indicator-close');
  var deleteDialog = document.getElementById('delete-confirmation-dialog');
  var deleteCancelBtn = document.getElementById('delete-cancel-btn');
  var deleteConfirmBtn = document.getElementById('delete-confirm-btn');

  var MESSAGE_PAGE_SIZE = 10;
  var currentPage = 0;
  var allMessages = [];
  var hasMoreMessages = true;
  var editingMessageId = null;
  var messageToDeleteId = null;
  var realtimeChannel = null;

  // --- Pre-fill guest name from window.guestName if available ---
  function initGuestName() {
    if (guestName && !guestName.value && window.guestName) {
      guestName.value = window.guestName;
    }
  }

  // --- Char counter ---
  if (messageInput) {
    messageInput.addEventListener('input', function () {
      var len = this.value.length;
      if (charCounter) charCounter.textContent = len + ' / 500';
      if (charWarning) {
        charWarning.style.display = len >= 500 ? 'inline' : 'none';
      }
    });
  }

  // --- Format Relative Time in Indonesian ---
  function formatRelativeTime(dateInput) {
    if (!dateInput) return 'Baru saja';

    var date;
    if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else if (typeof dateInput === 'number') {
      date = new Date(dateInput);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      return 'Baru saja';
    }

    if (isNaN(date.getTime())) {
      return 'Baru saja';
    }

    var now = new Date();
    var diffMs = now.getTime() - date.getTime();

    // If in the future or less than 15 seconds ago
    if (diffMs < 15000) {
      return 'Baru saja';
    }

    var diffSec = Math.floor(diffMs / 1000);
    var diffMin = Math.floor(diffSec / 60);
    var diffHour = Math.floor(diffMin / 60);
    var diffDay = Math.floor(diffHour / 24);
    var diffWeek = Math.floor(diffDay / 7);
    var diffMonth = Math.floor(diffDay / 30);
    var diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) {
      return 'Baru saja';
    } else if (diffMin < 60) {
      return diffMin + ' menit yang lalu';
    } else if (diffHour < 24) {
      return diffHour + ' jam yang lalu';
    } else if (diffDay < 7) {
      return diffDay + ' hari yang lalu';
    } else if (diffWeek < 5) {
      return diffWeek + ' minggu yang lalu';
    } else if (diffMonth < 12) {
      return diffMonth + ' bulan yang lalu';
    } else {
      return diffYear + ' tahun yang lalu';
    }
  }

  // --- Reset Edit Mode ---
  function resetFormState() {
    editingMessageId = null;
    if (rsvpForm) {
      rsvpForm.reset();
      rsvpForm.classList.remove('is-editing');
    }
    initGuestName();
    if (charCounter) charCounter.textContent = '0 / 500';
    if (charWarning) charWarning.style.display = 'none';

    if (editIndicator) {
      editIndicator.style.display = 'none';
    }

    if (submitBtn) {
      submitBtn.innerHTML = '<i class="bi bi-send" aria-hidden="true"></i> Kirim Ucapan';
    }

    if (cancelEditBtn) {
      cancelEditBtn.style.display = 'none';
    }
  }

  // Cancel edit listeners
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', resetFormState);
  }
  if (editIndicatorClose) {
    editIndicatorClose.addEventListener('click', resetFormState);
  }

  var RATE_LIMIT_SECONDS = 20;

  // --- Form submit (Insert or Update) ---
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = guestName ? guestName.value.trim() : '';
      var attend = attendance ? attendance.value : 'hadir';
      var msg = messageInput ? messageInput.value.trim() : '';

      if (!name) {
        if (window.showNotification) window.showNotification('Mohon isi nama Anda.', 'info');
        return;
      }

      if (editingMessageId) {
        // Mode Edit Pesan
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin" aria-hidden="true"></i> Menyimpan...';
        }
        updateMessage(editingMessageId, name, attend, msg);
      } else {
        // Cek Rate-Limit (Cooldown anti-spam 20 detik)
        var lastRsvp = localStorage.getItem('last_rsvp_time');
        if (lastRsvp) {
          var elapsedSec = Math.floor((Date.now() - parseInt(lastRsvp, 10)) / 1000);
          if (elapsedSec < RATE_LIMIT_SECONDS) {
            var waitSec = RATE_LIMIT_SECONDS - elapsedSec;
            if (window.showNotification) {
              window.showNotification('Mohon tunggu ' + waitSec + ' detik sebelum mengirim ucapan baru.', 'info');
            }
            return;
          }
        }

        // Mode Kirim Pesan Baru
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin" aria-hidden="true"></i> Mengirim...';
        }

        if (window.supabaseClient) {
          submitToSupabase(name, attend, msg);
        } else {
          addLocalMessage(name, attend, msg);
          localStorage.setItem('last_rsvp_time', Date.now().toString());
          if (window.showNotification) {
            var note = (typeof weddingConfig !== 'undefined' && weddingConfig.rsvp && weddingConfig.rsvp.previewModeNote)
              ? 'Terima kasih! ' + weddingConfig.rsvp.previewModeNote
              : 'Terima kasih atas ucapan Anda! (Mode demo — pesan lokal)';
            window.showNotification(note, 'success');
          }
          resetFormState();
        }
      }
    });
  }

  function submitToSupabase(name, attend, msg) {
    var userId = window.userId || 'anonymous';
    var tableName = window.supabaseTableName || 'rsvp_messages';

    window.supabaseClient
      .from(tableName)
      .insert([{
        guest_name: name,
        attendance: attend,
        message: msg,
        user_id: userId,
        created_at: new Date().toISOString()
      }])
      .then(function (result) {
        if (result.error) {
          throw result.error;
        }
        localStorage.setItem('last_rsvp_time', Date.now().toString());
        if (window.showNotification) {
          window.showNotification('Terima kasih atas ucapan & doa Anda!', 'success');
        }
        resetFormState();
        fetchMessages(false);
      })
      .catch(function (err) {
        console.error('[script_form] Submit error:', err);
        addLocalMessage(name, attend, msg);
        localStorage.setItem('last_rsvp_time', Date.now().toString());
        if (window.showNotification) {
          window.showNotification('Pesan tersimpan secara lokal.', 'info');
        }
        resetFormState();
      });
  }

  function updateMessage(id, name, attend, msg) {
    var userId = window.userId || 'anonymous';
    var tableName = window.supabaseTableName || 'rsvp_messages';

    if (window.supabaseClient) {
      window.supabaseClient
        .from(tableName)
        .update({
          guest_name: name,
          attendance: attend,
          message: msg
        })
        .eq('id', id)
        .eq('user_id', userId)
        .then(function (result) {
          if (result.error) throw result.error;
          if (window.showNotification) {
            window.showNotification('Pesan berhasil diperbarui!', 'success');
          }
          resetFormState();
          fetchMessages(false);
        })
        .catch(function (err) {
          console.error('[script_form] Update error:', err);
          updateLocalMessage(id, name, attend, msg);
          if (window.showNotification) {
            window.showNotification('Pesan diperbarui secara lokal.', 'info');
          }
          resetFormState();
        });
    } else {
      updateLocalMessage(id, name, attend, msg);
      if (window.showNotification) {
        window.showNotification('Pesan diperbarui secara lokal.', 'info');
      }
      resetFormState();
    }
  }

  function deleteMessage(id) {
    var userId = window.userId || 'anonymous';
    var tableName = window.supabaseTableName || 'rsvp_messages';

    if (window.supabaseClient) {
      window.supabaseClient
        .from(tableName)
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .then(function (result) {
          if (result.error) throw result.error;
          if (window.showNotification) {
            window.showNotification('Pesan berhasil dihapus.', 'success');
          }
          allMessages = allMessages.filter(function (m) { return String(m.id) !== String(id); });
          renderMessages();
        })
        .catch(function (err) {
          console.error('[script_form] Delete error:', err);
          deleteLocalMessage(id);
          if (window.showNotification) {
            window.showNotification('Pesan dihapus.', 'info');
          }
        });
    } else {
      deleteLocalMessage(id);
      if (window.showNotification) {
        window.showNotification('Pesan dihapus.', 'info');
      }
    }
  }

  // --- Local Fallback Handlers ---
  function addLocalMessage(name, attend, msg) {
    var message = {
      id: Date.now(),
      guest_name: name,
      attendance: attend,
      message: msg,
      user_id: window.userId || 'anonymous',
      created_at: new Date().toISOString()
    };
    allMessages.unshift(message);
    renderMessages();
  }

  function updateLocalMessage(id, name, attend, msg) {
    allMessages = allMessages.map(function (m) {
      if (String(m.id) === String(id)) {
        return Object.assign({}, m, { guest_name: name, attendance: attend, message: msg });
      }
      return m;
    });
    renderMessages();
  }

  function deleteLocalMessage(id) {
    allMessages = allMessages.filter(function (m) { return String(m.id) !== String(id); });
    renderMessages();
  }

  // --- Fetch Messages (with pagination) ---
  function fetchMessages(append) {
    if (!append) {
      currentPage = 0;
    }

    if (!window.supabaseClient) {
      renderMessages();
      return;
    }

    var tableName = window.supabaseTableName || 'rsvp_messages';
    var from = currentPage * MESSAGE_PAGE_SIZE;
    var to = from + MESSAGE_PAGE_SIZE - 1;

    window.supabaseClient
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)
      .then(function (result) {
        if (result.data) {
          if (append) {
            allMessages = allMessages.concat(result.data);
          } else {
            allMessages = result.data;
          }
          hasMoreMessages = result.data.length === MESSAGE_PAGE_SIZE;
          renderMessages();
        }
      })
      .catch(function (err) {
        console.error('[script_form] Fetch error:', err);
        renderMessages();
      });
  }

  // --- Render Messages in UI ---
  function renderMessages() {
    if (!guestMessages) return;
    guestMessages.innerHTML = '';

    if (allMessages.length === 0) {
      guestMessages.innerHTML = '<div style="text-align:center;padding:24px 12px;font-family:var(--font-body);font-size:14px;color:var(--color-primary-400);">Belum ada pesan. Jadilah yang pertama memberikan doa restu!</div>';
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    var currentUserId = window.userId || '';

    allMessages.forEach(function (msg) {
      var card = document.createElement('div');
      card.className = 'guest-message-card';

      var isHadir = msg.attendance === 'hadir';
      var attendText = isHadir ? 'Hadir' : 'Tidak Hadir';
      var badgeClass = isHadir ? 'msg-badge-hadir' : 'msg-badge-tidak-hadir';
      var timeAgo = formatRelativeTime(msg.created_at);
      var isOwner = currentUserId && msg.user_id && msg.user_id === currentUserId;

      var actionsHtml = '';
      if (isOwner) {
        actionsHtml = 
          '<div class="msg-actions">' +
            '<button type="button" class="btn-edit-msg" data-id="' + msg.id + '" title="Edit Pesan" aria-label="Edit Pesan">' +
              '<i class="bi bi-pencil-square" aria-hidden="true"></i>' +
            '</button>' +
            '<button type="button" class="btn-delete-msg" data-id="' + msg.id + '" title="Hapus Pesan" aria-label="Hapus Pesan">' +
              '<i class="bi bi-trash3" aria-hidden="true"></i>' +
            '</button>' +
          '</div>';
      }

      card.innerHTML = 
        '<div class="msg-header">' +
          '<p class="msg-name">' + escapeHtml(msg.guest_name) + '</p>' +
          '<div class="msg-badges-actions">' +
            '<span class="msg-badge-attendance ' + badgeClass + '">' + attendText + '</span>' +
            actionsHtml +
          '</div>' +
        '</div>' +
        '<p class="msg-text">' + escapeHtml(msg.message || '') + '</p>' +
        '<div class="msg-footer">' +
          '<span class="msg-time"><i class="bi bi-clock" aria-hidden="true"></i> ' + escapeHtml(timeAgo) + '</span>' +
        '</div>';

      guestMessages.appendChild(card);
    });

    // Attach Event Listeners for Edit & Delete buttons
    var editButtons = guestMessages.querySelectorAll('.btn-edit-msg');
    editButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        startEditMessage(id);
      });
    });

    var deleteButtons = guestMessages.querySelectorAll('.btn-delete-msg');
    deleteButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        openDeleteDialog(id);
      });
    });

    if (loadMoreBtn) {
      loadMoreBtn.style.display = hasMoreMessages && allMessages.length >= MESSAGE_PAGE_SIZE ? 'block' : 'none';
    }
  }

  // --- Start Edit Mode ---
  function startEditMessage(id) {
    var target = allMessages.find(function (m) { return String(m.id) === String(id); });
    if (!target) return;

    editingMessageId = target.id;
    if (guestName) guestName.value = target.guest_name;
    if (attendance) attendance.value = target.attendance || 'hadir';
    if (messageInput) {
      messageInput.value = target.message || '';
      if (charCounter) charCounter.textContent = (target.message || '').length + ' / 500';
    }

    if (rsvpForm) {
      rsvpForm.classList.add('is-editing');
    }

    if (editIndicator) {
      editIndicator.style.display = 'flex';
    }

    if (submitBtn) {
      submitBtn.innerHTML = '<i class="bi bi-check-lg" aria-hidden="true"></i> Simpan Perubahan';
    }

    if (cancelEditBtn) {
      cancelEditBtn.style.display = 'inline-flex';
    }

    if (rsvpForm) {
      rsvpForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // --- Delete Dialog Confirmation ---
  function openDeleteDialog(id) {
    messageToDeleteId = id;
    if (deleteDialog) deleteDialog.style.display = 'flex';
  }

  function closeDeleteDialog() {
    messageToDeleteId = null;
    if (deleteDialog) deleteDialog.style.display = 'none';
  }

  if (deleteCancelBtn) {
    deleteCancelBtn.addEventListener('click', closeDeleteDialog);
  }

  if (deleteConfirmBtn) {
    deleteConfirmBtn.addEventListener('click', function () {
      if (messageToDeleteId) {
        deleteMessage(messageToDeleteId);
        closeDeleteDialog();
      }
    });
  }

  if (deleteDialog) {
    deleteDialog.addEventListener('click', function (e) {
      if (e.target === deleteDialog) closeDeleteDialog();
    });
  }

  // --- Load More Button ---
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      currentPage++;
      fetchMessages(true);
    });
  }

  // --- Realtime Sync ---
  function setupRealtime() {
    if (!window.supabaseClient) return;
    var tableName = window.supabaseTableName || 'rsvp_messages';

    try {
      realtimeChannel = window.supabaseClient
        .channel('public:' + tableName)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, function (payload) {
          console.log('[script_form] Realtime event:', payload.eventType);
          fetchMessages(false);
        })
        .subscribe();
    } catch (e) {
      console.warn('[script_form] Realtime subscription error:', e);
    }
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initial setup
  initGuestName();
  setTimeout(function () {
    fetchMessages(false);
    setupRealtime();
  }, 1000);

  console.log('[script_form.js] Initialized with Auto-fill, Edit, Delete, Realtime & Fallback support.');
})();
