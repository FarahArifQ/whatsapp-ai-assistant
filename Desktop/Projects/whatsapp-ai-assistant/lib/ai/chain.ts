import { GoogleGenerativeAI } from '@google/generative-ai'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import { generateEmbedding } from './embeddings'
import { buildSystemPrompt } from './prompts'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

async function retrieveContext(query: string): Promise<string> {
  try {
    const embedding = await generateEmbedding(query)
    const { data } = await createSupabaseServiceClient().rpc('match_knowledge', {
      query_embedding: embedding,
      match_count: 5,
    })
    if (!data || data.length === 0) return ''
    return data.map((row: { content: string }) => row.content).join('\n\n')
  } catch {
    return ''
  }
}

export async function runChain(userMessage: string, history: { role: string; content: string }[] = []): Promise<string> {
  const context = await retrieveContext(userMessage)
  const systemPrompt = buildSystemPrompt(context)

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I will answer based on the knowledge base provided.' }] },
      ...history.map(h => ({
        role: h.role as 'user' | 'model',
        parts: [{ text: h.content }],
      })),
    ],
  })

  const result = await chat.sendMessage(userMessage)
  return result.response.text()
}
