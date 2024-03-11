import type { APIRoute } from 'astro'
import { URL } from 'url'
import { submitAuthCode } from '../lib/spotify/spotifyApi'

export const GET: APIRoute = async ({ request, cookies, redirect, locals }) => {
  const authCode = new URL(request.url).searchParams.get('code')
  if (!authCode) {
    return redirect('/')
  }

  try {
    const tokenResponse = await submitAuthCode(authCode)

    const expiry = new Date()
    expiry.setSeconds(expiry.getSeconds() + tokenResponse.expires_in)
    cookies.set('spotify_token', tokenResponse.access_token, {
      expires: expiry,
    })

    return redirect('/results')
  } catch (e) {
    console.error(e)
    return redirect('/')
  }
}
