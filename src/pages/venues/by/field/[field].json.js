import venues from '@data/dist/venues/venues.json'

export function createHandler() {
  return async ({ params }) => {
    const field = params.field
    const values = venues.map((p) => p[field])

    const mapped = {}
    values.forEach((val) => {
      mapped[val] = venues.filter((v) => v[field] == val)
    })

    if (!mapped) {
      return new Response(JSON.stringify({ error: 'Venue not found' }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify(mapped), {
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
        const fields = Object.keys(venue) //.filter((k) => k.endsWith('_id'))
        return fields
          .filter((field) => venue[field] != null)
          .map((field) => ({
            params: {
              field: field,
            },
          }))
      })
      .flat()
  }
}

export const GET = createHandler()

export const getStaticPaths = createStaticPaths()
