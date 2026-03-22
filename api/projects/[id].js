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
  const { id } = req.query

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Project not found' })
    }

    return res.status(200).json({ project: data })
  }

  if (req.method === 'PATCH') {
    const payload = verifyToken(req)
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { title, description, image, category, sort_order } = req.body
    const updates = {}
    if (title !== undefined) updates.title = title
    if (description !== undefined) updates.description = description
    if (image !== undefined) updates.image = image
    if (category !== undefined) updates.category = category
    if (sort_order !== undefined) updates.sort_order = sort_order

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: 'Failed to update project' })
    }

    return res.status(200).json({ project: data })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
