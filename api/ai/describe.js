import Anthropic from '@anthropic-ai/sdk'
import jwt from 'jsonwebtoken'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function verifyToken(req) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return null
  try {
    return jwt.verify(auth.split(' ')[1], process.env.ADMIN_PASSWORD)
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const payload = verifyToken(req)
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { imageUrl } = req.body

  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl is required' })
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: imageUrl,
              },
            },
            {
              type: 'text',
              text: `You are helping a graphic designer write about their work for their portfolio website.
              
Analyse this design work and write a short portfolio description. Include:
1. A one-sentence summary of what the work is
2. Two or three sentences about the visual approach, inspiration, or creative decisions

Keep the tone professional but warm. Do not use bullet points. Maximum 100 words.`,
            },
          ],
        },
      ],
    })

    const description = message.content[0].text

    return res.status(200).json({ description })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to generate description' })
  }
}