import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

const MAX_MESSAGES = 10
const CONVERSATION_TTL = 60 * 60 * 24

export type Message = {
  role: 'customer' | 'assistant'
  content: string
  timestamp: number
}

export async function getConversationHistory(
  phoneNumber: string
): Promise<Message[]> {
  const key = `conversation:${phoneNumber}`
  const data = await redis.get(key)
  if (!data) return []
  return data as Message[]
}

export async function addMessageToHistory(
  phoneNumber: string,
  message: Message
): Promise<void> {
  const key = `conversation:${phoneNumber}`
  const history = await getConversationHistory(phoneNumber)
  history.push(message)
  const trimmed = history.slice(-MAX_MESSAGES)
  await redis.set(key, trimmed, { ex: CONVERSATION_TTL })
}

export async function clearConversationHistory(
  phoneNumber: string
): Promise<void> {
  await redis.del(`conversation:${phoneNumber}`)
}
