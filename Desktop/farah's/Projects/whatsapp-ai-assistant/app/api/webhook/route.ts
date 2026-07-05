import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/whatsapp/verify'
import { sendWhatsAppMessage } from '@/lib/whatsapp/client'
import { runChain } from '@/lib/ai/chain'
import {
  getConversationHistory,
  addMessageToHistory,
  redis,
} from '@/lib/memory/redis'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import type { WhatsAppWebhookBody } from '@/lib/whatsapp/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-hub-signature-256') || ''
    const appSecret = process.env.WHATSAPP_APP_SECRET || ''

    if (appSecret && !verifyWebhookSignature(rawBody, signature, appSecret)) {
      console.error('Invalid webhook signature')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const clientIp = req.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = `rate_limit:${clientIp}`
    const requests = await redis.incr(rateLimitKey)
    if (requests === 1) {
      await redis.expire(rateLimitKey, 60)
    }
    if (requests > 30) {
      console.log('Rate limit exceeded for IP:', clientIp)
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    const body: WhatsAppWebhookBody = JSON.parse(rawBody)
    const entry = body.entry?.[0]
    const change = entry?.changes?.[0]
    const message = change?.value?.messages?.[0]

    if (!message || message.type !== 'text' || !message.text?.body) {
      return new NextResponse('OK', { status: 200 })
    }

    const customerPhone = message.from
    const customerMessage = message.text.body
    const phoneNumberId = change.value.metadata.phone_number_id


    // Look up which business owns this WhatsApp number
    const supabase = createSupabaseServiceClient()
    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('whatsapp_phone_number_id', phoneNumberId)
      .single()

    if (!business) {
      console.log('No business found for phone:', phoneNumberId)
      return new NextResponse('OK', { status: 200 })
    }
    const businessId = business.id
    const botPersona = business?.bot_persona ?? undefined


    // Get conversation history from Redis
    const history = await getConversationHistory(customerPhone)
    const formattedHistory = history.map(m => ({
      role: m.role === 'customer' ? 'user' : 'model',
      content: m.content,
    }))

    // Run AI chain with business-specific knowledge
    const aiReply = await runChain(
      customerMessage,
      formattedHistory,
      businessId,
      botPersona
    )

    // Send reply back to customer
    await sendWhatsAppMessage(customerPhone, aiReply, phoneNumberId)

    // Save to Redis
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

    // Save to Supabase with business_id
    const { error } = await supabase.from('conversations').insert([
      {
        business_id: businessId,
        customer_phone: customerPhone,
        message: customerMessage,
        role: 'customer',
      },
      {
        business_id: businessId,
        customer_phone: customerPhone,
        message: aiReply,
        role: 'assistant',
      },
    ])
    if (error) console.error('Insert error:', error)

    return new NextResponse('OK', { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('OK', { status: 200 })
  }
}