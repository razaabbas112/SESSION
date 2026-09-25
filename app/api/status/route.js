export async function GET(request) {
  try {
    const { searchParams } =
      new URL(request.url)

    const id =
      searchParams.get('id')

    if (!id) {
      return Response.json(
        {
          success: false,
          error: 'Missing pairing id'
        },
        {
          status: 400
        }
      )
    }

    const api =
      process.env.PAIR_SERVER_URL

    if (!api) {
      return Response.json(
        {
          success: false,
          error:
            'PAIR_SERVER_URL is not configured'
        },
        {
          status: 500
        }
      )
    }

    const response =
      await fetch(
        `${api}/status/${encodeURIComponent(id)}`,
        {
          cache: 'no-store'
        }
      )

    const data =
      await response.json()

    return Response.json(
      data,
      {
        status:
          response.status
      }
    )

  } catch (error) {
    return Response.json(
      {
        success: false,
        error:
          error?.message ||
          'Status server unavailable'
      },
      {
        status: 502
      }
    )
  }
}
