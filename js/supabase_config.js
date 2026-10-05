/* ============================================================
   Earthy Botanical — js/supabase_config.js
   Reads weddingConfig.supabase — no-op if disabled
   Actual CRUD = backend concern
   ============================================================ */

(function () {
  'use strict';

  var supabaseClient = null;

  if (typeof weddingConfig === 'undefined') {
    console.warn('[supabase_config] weddingConfig not loaded');
    return;
  }

  var supabaseConfig = weddingConfig.supabase || {};

  if (!supabaseConfig.enabled) {
    console.warn('[supabase_config] Supabase is disabled. RSVP will use fallback mode.');
    window.supabaseClient = null;
    return;
  }

  var apiKey = supabaseConfig.publishableKey || supabaseConfig.anonKey || supabaseConfig.apiKey;

  if (!supabaseConfig.url || !apiKey) {
    console.warn('[supabase_config] Supabase URL or publishableKey/anonKey is empty. RSVP will use fallback mode.');
    window.supabaseClient = null;
    return;
  }

  if (typeof window.supabase === 'undefined') {
    console.warn('[supabase_config] Supabase JS library not loaded.');
    window.supabaseClient = null;
    return;
  }

  try {
    supabaseClient = window.supabase.createClient(supabaseConfig.url, apiKey);
    window.supabaseClient = supabaseClient;
    window.supabaseTableName = supabaseConfig.tableName || 'rsvp_messages';
    console.log('[supabase_config] Supabase client initialized.');
  } catch (e) {
    console.error('[supabase_config] Failed to create Supabase client:', e);
    window.supabaseClient = null;
  }
})();
