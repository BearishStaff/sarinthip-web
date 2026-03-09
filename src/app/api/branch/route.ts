import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const baseApiUrl = process.env.NEXT_PUBLIC_SERVICE_URL
    const apiUrl = `${baseApiUrl}/api/v1/branches`

    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data, { status: res.status })
    } else {
      return NextResponse.json(null, { status: res.status })
    }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
