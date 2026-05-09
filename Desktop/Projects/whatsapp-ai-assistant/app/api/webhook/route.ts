import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/whatsapp/verify'
import { sendWhatsAppMessage } from '@/lib/whatsapp/client'
import { runChain } from '@/lib/ai/chain'
import {
  getConversationHistory,
  addMessageToHistory,
} from '@/lib/memory/redis'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import type { WhatsAppWebhookBody } from '@/lib/whatsapp/types'

// ─── GET ──────────────────────────────────────────────────────
// Meta calls this once when you register your webhook URL
// It sends a challenge string and expects you to echo it back
// This proves you own the server
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  // Check the token matches what you set in .env.local
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('Webhook verified by Meta')
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

// ─── POST ─────────────────────────────────────────────────────
// Meta calls this every time a customer sends a message
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()

    // Step 1 — Verify the request is genuinely from Meta
    const signature = req.headers.get('x-hub-signature-256') || ''
    const appSecret = process.env.WHATSAPP_APP_SECRET || ''

    if (appSecret && !verifyWebhookSignature(rawBody, signature, appSecret)) {
      console.error('Invalid webhook signature')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body: WhatsAppWebhookBody = JSON.parse(rawBody)

    // Step 2 — Dig into the nested Meta payload to get the message
    const entry = body.entry?.[0]
    const change = entry?.changes?.[0]
    const message = change?.value?.messages?.[0]

    // If there's no message (could be a status update), just return 200
    // Meta sends delivery receipts and read receipts too — we ignore those
    if (!message || message.type !== 'text' || !message.text?.body) {
      return new NextResponse('OK', { status: 200 })
    }

    const customerPhone = message.from
    const customerMessage = message.text.body
    const phoneNumberId = change.value.metadata.phone_number_id

    console.log(`Message from ${customerPhone}: ${customerMessage}`)

    // Step 3 — Get conversation history from Redis
    const history = await getConversationHistory(customerPhone)

    // Step 4 — Run the AI chain to get a reply
    // We format history the way our chain expects it
    const formattedHistory = history.map(m => ({
      role: m.role === 'customer' ? 'user' : 'model',
      content: m.content,
    }))

    const aiReply = await runChain(customerMessage, formattedHistory)

    // Step 5 — Send the reply back to the customer
    await sendWhatsAppMessage(customerPhone, aiReply, phoneNumberId)

    // Step 6 — Save both messages to Redis for next conversation turn
    const now = Date.now()

    await addMessageToHistory(customerPhone, {
      role: 'customer',
      content: customerMessage,
      timestamp: now,
    })

    await addMessageToHistory(customerPhone, {
      role: 'assistant',
      content: aiReply,
      timestamp: now,
    })

    // Step 7 — Log conversation to Supabase for the dashboard
    const supabase = createSupabaseServiceClient()

    await supabase.from('conversations').insert([
      {
        customer_phone: customerPhone,
        message: customerMessage,
        role: 'customer',
      },
      {
        customer_phone: customerPhone,
        message: aiReply,
        role: 'assistant',
      },
    ])

    // Always return 200 quickly — Meta will retry if you don't
    return new NextResponse('OK', { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    // Still return 200 so Meta doesn't spam retry requests
    return new NextResponse('OK', { status: 200 })
  }
}