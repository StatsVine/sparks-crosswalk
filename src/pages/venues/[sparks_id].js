import venues from '@data/dist/venues/by_field/venues.sparks_id.json'

export function createHandler() {
  return async ({ params }) => {
    const venueId = params.sparks_id
    const venue = venues[venueId]

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
    const venueIds = Object.keys(venues)

    return venueIds.map((id) => ({
      params: { data_type: 'venue', sparks_id: String(id) },
    }))
  }
}

export const GET = createHandler()
export const getStaticPaths = createStaticPaths()
