// submitContact.js — Configurable contact form submission
// Defaults to a fetch POST. Swap endpoint in .env for your platform.

const ENDPOINT = import.meta.env.VITE_SUBMIT_ENDPOINT
const LAYLO_API_KEY = import.meta.env.VITE_LAYLO_API_KEY

/**
 * Submit contact details to Laylo via GraphQL API.
 * 
 * @param {{ email: string, phone?: string }} data
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function submitContact({ email, phone }) {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'please enter a valid email address.' };
  }

  // Formatting phone for Laylo (usually expects E.164)
  const formattedPhone = phone ? phone.replace(/[^\d+]/g, '') : undefined;

  const variables = {
    email: email.trim().toLowerCase(),
    phoneNumber: formattedPhone || null,
  };

  const query = `
    mutation($email: String, $phoneNumber: String) {
      subscribeToUser(email: $email, phoneNumber: $phoneNumber)
    }
  `;

  // If no API key or endpoint configured for production, simulate success in dev
  if (!LAYLO_API_KEY && import.meta.env.DEV) {
    console.log('[submitContact] Dev Mode: Laylo GraphQL Variables:', variables);
    await new Promise(r => setTimeout(r, 1000));
    return { success: true, message: 'success' };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LAYLO_API_KEY}`
      },
      body: JSON.stringify({
        query,
        variables
      }),
    });

    const body = await res.json().catch(() => ({}));

    if (res.ok && body?.data?.subscribeToUser) {
      return { success: true, message: 'success' };
    }

    // Handle GraphQL errors
    const rawError = body?.errors?.[0]?.message || '';

    // User-friendly translations for common errors
    if (rawError.includes('Country not supported')) {
      return {
        success: false,
        message: 'sorry, this activation isn’t available in your region just yet ✦'
      };
    }

    if (rawError.includes('already subscribed') || rawError.includes('already exists')) {
      return {
        success: true, // Treat as success since they are already in the club
        message: 'you’re already in the club! proceed to download ✦'
      };
    }

    if (rawError.includes('invalid') || rawError.includes('required')) {
      return {
        success: false,
        message: 'please check your info and try again ✦'
      };
    }

    return {
      success: false,
      message: rawError || 'something went wrong. please try again ✦'
    };
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, message: 'network error. please check your connection ✦' };
  }
}
