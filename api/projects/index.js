import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

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
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch projects' })
    }

    return res.status(200).json({ projects: data })
  }

  if (req.method === 'POST') {
    const payload = verifyToken(req)
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { title, category, description, image, sort_order } = req.body

    const { data: maxData } = await supabase
      .from('projects')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxData?.sort_order ?? 0) + 1

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: title ?? 'Untitled',
        category: category ?? 'Professional',
        description: description ?? null,
        image: image ?? null,
        sort_order: sort_order ?? nextOrder,
      })
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: 'Failed to create project' })
    }

    return res.status(201).json({ project: data })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
