// submitContact.js — Configurable contact form submission
// Defaults to a fetch POST. Swap endpoint in .env for your platform.

const ENDPOINT = import.meta.env.VITE_SUBMIT_ENDPOINT || null;

/**
 * Submit contact details.
 * If VITE_SUBMIT_ENDPOINT is set, POSTs JSON to that URL.
 * Otherwise, logs to console (dev mode placeholder).
 *
 * For MailerLite: set VITE_SUBMIT_ENDPOINT to your MailerLite API proxy URL.
 * For Formspree: set VITE_SUBMIT_ENDPOINT to https://formspree.io/f/YOUR_ID
 *
 * @param {{ email: string, phone?: string }} data
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function submitContact({ email, phone }) {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'please enter a valid email address.' };
  }

  const payload = {
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : undefined,
    source: 'beautiful-life-cd-decorator',
    group: 'bestie-club',
    timestamp: new Date().toISOString(),
  };

  // If no endpoint configured, simulate success (dev/demo mode)
  if (!ENDPOINT) {
    console.log('[submitContact] No endpoint configured. Payload:', payload);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    return { success: true, message: 'success' };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { success: true, message: 'success' };
    }

    const body = await res.json().catch(() => ({}));
    return { success: false, message: body?.message || 'something went wrong. please try again.' };
  } catch {
    return { success: false, message: 'network error. please check your connection.' };
  }
}
