// This is the shape of the JSON body Meta sends to your webhook
// when a customer sends a WhatsApp message

export type WhatsAppWebhookBody = {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        messages?: Array<{
          from: string        // customer's phone number
          id: string          // unique message ID
          timestamp: string
          text?: {
            body: string      // the actual message text
          }
          type: string        // 'text', 'image', 'audio', etc.
        }>
      }
      field: string
    }>
  }>
}