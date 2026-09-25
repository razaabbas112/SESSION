export async function POST(request) {
  try {
    const body =
      await request.json()

    const number =
      String(body?.number || '')
        .replace(/\D/g, '')

    if (!number) {
      return Response.json(
        {
          success: false,
          error:
            'WhatsApp number is required'
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
        `${api}/pair`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            number
          }),
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
          'Pairing server unavailable'
      },
      {
        status: 502
      }
    )
  }
}
