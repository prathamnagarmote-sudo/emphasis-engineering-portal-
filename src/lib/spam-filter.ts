/**
 * Multi-layer AI & Heuristic Spam Classification Engine for Emphasis Engineering
 * Protects contact forms and enquiry endpoints from automated bots, high-entropy
 * hashes, numeric payloads, disposable spam networks, and promotional cold outreach.
 */

export interface SpamEvaluationResult {
  isSpam: boolean;
  score: number; // 0 (legitimate) to 1 (definite spam)
  reason: string;
}

export function evaluateEnquirySpam(data: {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  honeypot?: string;
  formTime?: number; // Milliseconds taken by user to fill the form
}): SpamEvaluationResult {
  const name = (data.name || '').trim();
  const email = (data.email || '').trim().toLowerCase();
  const subject = (data.subject || '').trim();
  const message = (data.message || '').trim();

  // 1. Layer 1: Honeypot check (Immediate 100% Bot Catch)
  if (data.honeypot && data.honeypot.trim().length > 0) {
    return { isSpam: true, score: 1.0, reason: 'Honeypot field filled by bot' };
  }

  // 2. Layer 1: Form submission speed (Bots submit in under 1.5 seconds)
  if (data.formTime !== undefined && data.formTime > 0 && data.formTime < 1500) {
    return { isSpam: true, score: 0.95, reason: 'Form submitted unnaturally fast (<1.5s)' };
  }

  // 3. Layer 2: Pure numeric message (e.g., "7652598328")
  if (/^\d{5,}$/.test(message)) {
    return { isSpam: true, score: 1.0, reason: 'Message contains pure numeric sequence' };
  }

  // 4. Layer 2: High Entropy / Gibberish Single-Token Message
  // Examples: QkYnTVVLi5WPjdrKnkROg3Qh3sU51B9rIf4bm89WeRILs77KPbdoERt
  if (/^[A-Za-z0-9+/=_-]{16,}$/.test(message) && !message.includes(' ')) {
    return { isSpam: true, score: 1.0, reason: 'Message is a single high-entropy random hash' };
  }

  // 5. Layer 2: Bot-Generated Random Names
  // Examples: mhu869uBB6, Gt3askarHV, VXfyGpcpulNSTQGzbHRwAMKa, bWgbkFcOeWJOoAAWRnMTHt
  if (isBotName(name)) {
    return { isSpam: true, score: 0.95, reason: `Bot-generated name pattern: "${name}"` };
  }

  // 6. Layer 2: Known Spam Networks & Disposable Domains
  const spamDomains = [
    'jmailservice.com',
    'fulldiets.com',
    'castrosfirm.com',
    'vzde.com',
    'kdmcontractingaz.com',
    'graphiteproductscorp.com',
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
  ];
  if (spamDomains.some((d) => email.endsWith('@' + d) || email.includes(`@${d}`))) {
    return { isSpam: true, score: 1.0, reason: `Known spam domain: "${email}"` };
  }

  // 7. Layer 3: Unsolicited Commercial Cold-Outreach & SEO Spam
  const promoPatterns = [
    /top of search results/i,
    /banner at the top/i,
    /drive targeted visitors/i,
    /show up first whenever someone searches/i,
    /campaign in less than 24 hours/i,
    /ranking on major search pages/i,
    /get noticed online/i,
    /500M\+ professional profiles/i,
    /send proud/i,
    /melotto/i,
    /redesign their websites/i,
    /freelance writer/i,
    /keyword options for your business/i,
    /targeted visitors coming to your site/i,
    /first whenever someone searches/i,
    /calendly\.com\/(?!sayeependke)/i,
    /calendar\.[a-z0-9-]+\.[a-z]+/i,
    /casino/i,
    /viagra/i,
    /crypto/i,
    /telegram @/i,
    /t\.me\//i,
  ];
  for (const re of promoPatterns) {
    if (re.test(message) || re.test(subject)) {
      return { isSpam: true, score: 0.9, reason: 'Unsolicited commercial marketing pitch' };
    }
  }

  // 8. Layer 3: Incomplete bot template
  if (message.startsWith('Hi, I’m Hannah from') && message.length < 35) {
    return { isSpam: true, score: 0.95, reason: 'Incomplete automated template' };
  }

  // 9. Layer 3: Suspiciously short/empty message (excluding common short greetings)
  if (message.length < 4 && !/^(hi|hello|help|hey|info)$/i.test(message)) {
    return { isSpam: true, score: 0.8, reason: 'Message body too short' };
  }

  // 10. Repeated character spam (e.g. aaaaaaaaaaaaaaaaa)
  if (/(.)\1{10,}/.test(message)) {
    return { isSpam: true, score: 0.95, reason: 'Repeated character spam' };
  }

  return { isSpam: false, score: 0.0, reason: 'Legitimate enquiry' };
}

function isBotName(name: string): boolean {
  if (!name) return true;
  const trimmed = name.trim();

  // If it has multiple words with normal formatting, typically a human
  if (trimmed.includes(' ')) {
    const parts = trimmed.split(/\s+/);
    // If every part is long and lacks vowels, likely a bot
    if (parts.some((p) => p.length > 12 && !/[aeiouyAEIOUY]/.test(p))) {
      return true;
    }
    return false;
  }

  // Single word names over 25 characters
  if (trimmed.length > 25) return true;

  // Single word names with length >= 8 that mix digits and letters (e.g., mhu869uBB6)
  if (/^[a-zA-Z0-9]{8,}$/.test(trimmed)) {
    if (/\d/.test(trimmed) && /[a-zA-Z]/.test(trimmed)) {
      return true;
    }

    // Heavy irregular mixed-casing (e.g., VXfyGpcpulNSTQGzbHRwAMKa)
    if (trimmed.length >= 12 && /[A-Z]/.test(trimmed) && /[a-z]/.test(trimmed)) {
      const uppers = trimmed.replace(/[^A-Z]/g, '').length;
      const lowers = trimmed.replace(/[^a-z]/g, '').length;
      if (uppers >= 3 && lowers >= 3) {
        return true;
      }
    }
  }

  return false;
}
