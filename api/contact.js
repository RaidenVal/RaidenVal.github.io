import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function classifyInquiry(name, message) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: `Classify this message sent to a graphic designer's portfolio website into exactly one of these categories:
- Job Opportunity
- Collaboration
- Feedback
- General

Name: ${name}
Message: ${message}

Reply with only the category name, nothing else.`,
        },
      ],
    })
    return response.content[0].text.trim()
  } catch {
    return 'General'
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, message, honeypot } = req.body

  if (honeypot) {
    return res.status(200).json({ success: true })
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    const inquiryType = await classifyInquiry(name, message)

    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({ name, email, message, inquiry_type: inquiryType })

    if (dbError) {
      console.error('Database error:', dbError)
      return res.status(500).json({ error: 'Failed to save submission' })
    }

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'jolenezou711@gmail.com',
      replyTo: email,
      subject: `[${inquiryType}] New message from ${name}`,
      html: `
        <p><strong>Type:</strong> ${inquiryType}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}