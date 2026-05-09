import axios from 'axios'

// Sends a text message to a WhatsApp user via Meta Cloud API
export async function sendWhatsAppMessage(
  to: string,          // customer's phone number
  message: string,     // the text to send
  phoneNumberId: string
): Promise<void> {
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`

  await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  )
}