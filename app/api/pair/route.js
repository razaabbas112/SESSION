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
          error: 'WhatsApp number is required'
        },
        {
          status: 400
        }
      )
    }

    return Response.json({
      success: true,
      code: 'RAZA-TEST'
    })

  } catch {
    return Response.json(
      {
        success: false,
        error: 'Invalid request'
      },
      {
        status: 400
      }
    )
  }
}
