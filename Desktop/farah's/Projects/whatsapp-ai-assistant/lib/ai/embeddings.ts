import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })

export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await model.embedContent(text)
  return result.embedding.values
}
