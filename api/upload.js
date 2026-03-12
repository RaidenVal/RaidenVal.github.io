import { v2 as cloudinary } from 'cloudinary'
import jwt from 'jsonwebtoken'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const payload = verifyToken(req)
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { image, filename } = req.body

  if (!image) {
    return res.status(400).json({ error: 'Image is required' })
  }

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: 'portfolio',
      public_id: filename ? filename.replace(/\.[^/.]+$/, '') : undefined,
      overwrite: true,
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
      ],
    })

    return res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Upload failed' })
  }
}