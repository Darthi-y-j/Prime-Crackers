/** Outgoing mail identity for customer auth emails (configure SMTP in Supabase). */
export const COMPANY_EMAIL = 'primecrackers@gmail.com'

export const COMPANY_EMAIL_SENDER_NAME = 'Prime Crackers'

export const COMPANY_EMAIL_SENDER = `${COMPANY_EMAIL_SENDER_NAME} <${COMPANY_EMAIL}>`

export function getAuthEmailSenderHint(): string {
  return `Look for an email from ${COMPANY_EMAIL_SENDER_NAME} (${COMPANY_EMAIL}). Check spam if you don't see it.`
}
