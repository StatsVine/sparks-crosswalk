import venues from '@data/dist/venues/venues.json';

export function createHandler() {
  return async ({ params }) => {
    const sourceId = params.source_id
    const field = params.field
    const venue = venues.filter((p) => p[field] === sourceId)

    if (!venue) {
      return new Response(JSON.stringify({ error: 'Venue not found' }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify(venue), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export function createStaticPaths() {
  return async () => {
    return venues
      .map((venue) => {
        const fields = Object.keys(venue)//.filter((k) => k.endsWith('_id'))
        return fields
          .filter((field) => venue[field] != null)
          .map((field) => ({
            params: {
              field: field,
              source_id: String(venue[field]),
              venue_id: String(venue['sparks_id']),
            },
          }))
      })
      .flat()
  }
}

export const GET = createHandler()

export const getStaticPaths = createStaticPaths()
