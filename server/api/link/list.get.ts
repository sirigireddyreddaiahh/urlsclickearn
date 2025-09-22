import { createError } from 'h3'
import { z } from 'zod'

export default eventHandler(async (event) => {
  try {
    const { cloudflare } = event.context
    if (!cloudflare || !cloudflare.env || !cloudflare.env.KV) {
      throw createError({
        statusCode: 500,
        statusMessage: 'KV binding not available. Please check your Cloudflare configuration.',
      })
    }

    const { KV } = cloudflare.env
    const { limit, cursor } = await getValidatedQuery(event, z.object({
      limit: z.coerce.number().max(1024).default(20),
      cursor: z.string().trim().max(1024).optional(),
    }).parse)

    const list = await KV.list({
      prefix: `link:`,
      limit,
      cursor: cursor || undefined,
    }).catch((error) => {
      console.error('Error listing KV namespace:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to list links from KV storage',
      })
    })

    if (!list) {
      return { links: [] }
    }

    if (Array.isArray(list.keys)) {
      try {
        list.links = await Promise.all(list.keys.map(async (key: { name: string }) => {
          const { metadata, value: link } = await KV.getWithMetadata(key.name, { type: 'json' })
          if (link) {
            return {
              ...metadata,
              ...link,
            }
          }
          return link
        }))
      }
      catch (error) {
        console.error('Error fetching link metadata:', error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to fetch link details',
        })
      }
    }

    delete list.keys
    return list
  }
  catch (error) {
    console.error('Link list endpoint error:', error)
    if (error.statusCode && error.statusMessage) {
      throw error // Re-throw h3 errors
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching links',
    })
  }
})
