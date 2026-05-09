import { createHmac } from 'crypto'

// Meta signs every webhook request with your app secret
// We verify that signature to confirm the request is genuine
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  appSecret: string
): boolean {
  const expectedSignature = createHmac('sha256', appSecret)
    .update(payload)
    .digest('hex')

  return `sha256=${expectedSignature}` === signature
}